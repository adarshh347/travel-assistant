import json
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, ToolMessage
from langgraph.graph import MessagesState

from backend.app.core.config import settings
from backend.app.services.weather_service import get_weather, get_weather_multi


# -------------------------
# 1. Define Tools
# -------------------------

@tool
async def check_weather_tool(city: str):
    """
    Get the current weather of a specific city. 
    Input is just the city name (e.g., "Tokyo").
    """
    return await get_weather(city)


@tool
async def check_nearby_weather_tool(main_city: str, nearby_cities: str):
    """
    Get weather for a main city AND up to 3 nearby cities/districts simultaneously.
    Input:
    - main_city: The primary city user asked about (e.g., "Kyoto")
    - nearby_cities: A COMMA-SEPARATED string of nearby places (e.g., "Osaka, Nara, Kobe")
    """
    # Convert comma string to list
    city_list = [main_city] + [c.strip() for c in nearby_cities.split(",") if c.strip()]
    return await get_weather_multi(city_list)


tools = [check_weather_tool, check_nearby_weather_tool]

# -------------------------
# 2. Define LLM & Bind Tools
# -------------------------
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.1-8b-instant",
    groq_api_key=settings.GROQ_API_KEY,
)

# CRITICAL: We must bind the tools to the LLM so it knows how to call them
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """
You are a helpful Japanese travel and outing assistant.
Your goal is to suggest activities based on the weather.
Always answer in polite Japanese (Keigo).

RULES:
1. If the user asks about a location, ALWAYS identify the main city AND 3 nearby major cities/districts.
2. Use the 'check_nearby_weather_tool' to fetch data for all of them at once.
3. After the tool returns data, summarize the weather and suggest an itinerary.
"""

# -------------------------
# 3. Tool Router Node
# -------------------------
tool_node = ToolNode(tools)


# -------------------------
# 4. Model Node
# -------------------------
async def call_model(state: MessagesState):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *state["messages"]
    ]
    # We use llm_with_tools here
    response = await llm_with_tools.ainvoke(messages)
    return {"messages": [response]}


# -------------------------
# 5. Router Logic
# -------------------------
def should_call_tool(state: MessagesState):
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return "end"


# -------------------------
# 6. Build LangGraph
# -------------------------
graph = StateGraph(MessagesState)

graph.add_node("model", call_model)
graph.add_node("tools", tool_node)

graph.set_entry_point("model")

graph.add_conditional_edges(
    "model",
    should_call_tool,
    {"tools": "tools", "end": END},
)

graph.add_edge("tools", "model")

app = graph.compile()


# -------------------------
# 7. Callable function (Updated for Frontend Data)
# -------------------------
async def get_chat_response(user_input: str):
    """
    Runs the agent and returns both the text response AND any structured weather data 
    found in the tool execution history.
    """
    result = await app.ainvoke({"messages": [HumanMessage(user_input)]})

    messages = result["messages"]
    last_message = messages[-1].content

    weather_data = None

    # Scan history: Did we call the nearby_weather tool?
    # We look for a ToolMessage that matches our tool name
    for msg in reversed(messages):
        if isinstance(msg, ToolMessage) and msg.name == "check_nearby_weather_tool":
            try:
                # The content of a ToolMessage is a stringified JSON from our service
                weather_data = json.loads(msg.content)
            except:
                pass
            break

    return {
        "response": last_message,
        "weather_data": weather_data
    }