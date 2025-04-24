import json
from pathlib import Path

# Path to the JSON file for storing user credentials
USERS_FILE = Path("users.json")

# Ensure the JSON file exists
if not USERS_FILE.exists():
    USERS_FILE.write_text("[]")


# Helper functions to read and write users
def read_users():
    with open(USERS_FILE, "r") as file:
        return json.load(file)


def write_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)
