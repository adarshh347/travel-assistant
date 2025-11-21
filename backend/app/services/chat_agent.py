from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.graph import MessagesState

from backend.app.core.config import settings
from backend.app.services.weather_service import get_weather



@tool
async def check_weather_tool(city: str):
    """Get the current weather of a city. Input is a city name."""
    return await get_weather(city)

tools = [check_weather_tool]


# -------------------------
# 2. Define LLM
# -------------------------
llm = ChatGroq(
    temperature=0,
    model_name="llama-3.1-8b-instant",
    groq_api_key=settings.GROQ_API_KEY,
)


SYSTEM_PROMPT = """
You are a helpful Japanese travel and outing assistant.
Your goal is to suggest activities based on the weather.
Always answer in polite Japanese (Keigo).
If the user asks about travel, first check the weather using the tool,
then suggest an itinerary.
"""


# -------------------------
# 3. Tool Router Node
# -------------------------
tool_node = ToolNode(tools)


# -------------------------
# 4. Model Node
# -------------------------
async def call_model(state: MessagesState):
    """Calls the LLM. If it returns tool calls, LangGraph routes automatically."""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *state["messages"]
    ]
    response = await llm.ainvoke(messages)
    return {"messages": [response]}


# -------------------------
# 5. Router: Decide tool vs. final answer
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
# 7. Callable function
# -------------------------
async def get_chat_response(user_input: str):
    """Send user message to LangGraph agent and return assistant's reply."""
    result = await app.ainvoke({"messages": [HumanMessage(user_input)]})
    return result["messages"][-1].content
