import json
import os


# Schema for chat history
# {
#     "user1_id": {
#         "conversation1_id": [...<conversation1_history>],
#         "conversation2_id": [...<conversation2_history>]
#     },
#     "user2_id": {
#         "conversation1_id": [...<conversation1_history>],
#         "conversation2_id": [...<conversation2_history>]
#     }
# }

# File to persist chat history
CHAT_HISTORY_FILE = "chat_history.json"


# Load chat history from file
def load_chat_history():
    if os.path.exists(CHAT_HISTORY_FILE):
        with open(CHAT_HISTORY_FILE, "r") as file:
            return json.load(file)
    return {}


# Save chat history to file
def save_chat_history(chat_histories):
    with open(CHAT_HISTORY_FILE, "w") as file:
        json.dump(chat_histories, file, indent=4)


# Initialize chat histories
chat_history = load_chat_history()
