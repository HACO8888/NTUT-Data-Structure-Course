from collections import deque

player_gold = 150
barracks_A = deque()
barracks_B = deque()


orders = [
    {"unit": "劍士", "cost": 20},
    {"unit": "弓手", "cost": 30},
    {"unit": "騎士", "cost": 50},
    {"unit": "投石車", "cost": 40}
]

for round_num, order in enumerate(orders):
    print(f"\n--- 第 {round_num} 回合 ---") # 方便看輸出結果

    # ---------------------------------------------------
    # TODO
    if round_num % 2 == 0:
        # A 廠 Underflow 防禦
        if len(barracks_A) > 0:
            finished_A = barracks_A.popleft()
            print(f"A 廠生產完成：{finished_A} 出列！")
        else:
            print("A 廠沒東西可做 (Underflow 防護成功)")

        # B 廠 Underflow 防禦
        if len(barracks_B) > 0:
            finished_B = barracks_B.popleft()
            print(f"B 廠生產完成：{finished_B} 出列！")
        else:
            print("B 廠沒東西可做 (Underflow 防護成功)")
    # ---------------------------------------------------

    # 處理新訂單
    if not order:
        print("玩家本回合無動作，單純推進時間")
    else:
        unit = order["unit"]
        cost = order["cost"]

        # 資源檢核
        if player_gold < cost:
            print(f"黃金不足 (剩:{player_gold})！取消生產 {unit}")
        else:
            # 負載平衡與 Overflow 判斷
            if len(barracks_A) == 2 and len(barracks_B) == 2:
                print(f"產線全滿！{unit} 訂單被拒絕")
            elif len(barracks_A) <= len(barracks_B) and len(barracks_A) < 2:
                barracks_A.append(unit)
                player_gold -= cost
                print(f"{unit} 分派至 A 廠 (剩餘黃金: {player_gold})")
            else:
                barracks_B.append(unit)
                player_gold -= cost
                print(f"{unit} 分派至 B 廠 (剩餘黃金: {player_gold})")

    print(f"A: {list(barracks_A)} | B: {list(barracks_B)}")