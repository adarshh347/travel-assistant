from langchain_groq import ChatGroq
from langchain.tools import tool
from langchain.agents import create_agent
from langchain.memory import ConversationBufferMemory  # Changed import

from backend.app.core.config import settings
from backend.app.services.weather_service import get_weather

@tool
async def check_weather_tool(city: str):
    """Get the current weather of a city. Input is a city name."""
    return await get_weather(city)

llm = ChatGroq(
    temperature=0,
    model_name="llama-3.1-8b-instant",
    groq_api_key=settings.GROQ_API_KEY
)

SYSTEM_PROMPT = """
You are a helpful Japanese travel and outing assistant.
Your goal is to suggest activities based on the weather.
Always answer in polite Japanese (Keigo).
If the user asks about travel, first check the weather using the tool,
then suggest an itinerary.
"""

tools = [check_weather_tool]

# Create agent with react style via agent type and prompt
react_agent = create_agent(
    llm=llm,
    tools=tools,
    agent_type="react",  # configure REACT style agent
    system_message=SYSTEM_PROMPT,
    memory=ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )
)

async def get_chat_response(user_input: str):
    # Directly call the async agent
    result = await react_agent.ainvoke(user_input)
    return result
