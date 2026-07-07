from typing import TypedDict
from langgraph.graph import StateGraph, END
from app.core.llm import get_llm
from app.core.vectorstore import get_vectorstore


class GmailChatState(TypedDict):
    session_id: str
    question: str
    context_docs: list
    answer: str


def retrieve_node(state: GmailChatState) -> GmailChatState:
    vs = get_vectorstore("gmail", state["session_id"])
    docs = vs.similarity_search(state["question"], k=4)
    state["context_docs"] = docs
    return state


def generate_node(state: GmailChatState) -> GmailChatState:
    llm = get_llm()
    context_text = "\n\n---\n\n".join(d.page_content for d in state["context_docs"])

    prompt = f"""You are answering questions about the user's emails using
only the context below. Reference the sender or subject when relevant. If
the answer isn't in the context, say you don't know.

Context:
{context_text}

Question: {state["question"]}

Answer:"""

    response = llm.invoke(prompt)
    state["answer"] = response.content
    return state


def build_gmail_graph():
    graph = StateGraph(GmailChatState)
    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate", generate_node)
    graph.set_entry_point("retrieve")
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", END)
    return graph.compile()


gmail_graph = build_gmail_graph()