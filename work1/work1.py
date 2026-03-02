import hashlib
import json
import os

DATA_FILE = "users.json"

def load_users():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(DATA_FILE, "w") as f:
        json.dump(users, f, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def register(users):
    print("\n=== 註冊 ===")
    username = input("請輸入用戶名: ").strip()
    if not username:
        print("❌ 用戶名不能為空！")
        return
    if username in users:
        print("❌ 用戶名已存在！")
        return
    password = input("請輸入密碼: ").strip()
    if len(password) < 6:
        print("❌ 密碼至少需要 6 個字元！")
        return
    confirm = input("請再次輸入密碼: ").strip()
    if password != confirm:
        print("❌ 兩次密碼不一致！")
        return
    users[username] = hash_password(password)
    save_users(users)
    print(f"✅ 用戶 '{username}' 註冊成功！")

def login(users):
    print("\n=== 登入 ===")
    username = input("請輸入用戶名: ").strip()
    password = input("請輸入密碼: ").strip()
    if username in users and users[username] == hash_password(password):
        print(f"✅ 歡迎回來，{username}！")
        return username
    else:
        print("❌ 用戶名或密碼錯誤！")
        return None

def user_menu(username):
    while True:
        print(f"\n=== 已登入：{username} ===")
        print("1. 查看個人資訊")
        print("2. 退出登入")
        choice = input("請選擇: ").strip()
        if choice == "1":
            print(f"\n👤 用戶名：{username}")
        elif choice == "2":
            print(f"👋 已退出登入，再見 {username}！")
            break
        else:
            print("❌ 無效選項！")

def main():
    users = load_users()
    print("╔══════════════════════╗")
    print("║   簡易帳號管理系統   ║")
    print("╚══════════════════════╝")

    while True:
        print("\n=== 主選單 ===")
        print("1. 註冊")
        print("2. 登入")
        print("3. 離開")
        choice = input("請選擇: ").strip()

        if choice == "1":
            register(users)
        elif choice == "2":
            logged_in_user = login(users)
            if logged_in_user:
                user_menu(logged_in_user)
        elif choice == "3":
            print("👋 再見！")
            break
        else:
            print("❌ 無效選項，請重新選擇！")

if __name__ == "__main__":
    main()