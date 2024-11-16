from selenium import webdriver
from selenium.webdriver.common.by import By
import time

options = webdriver.ChromeOptions()
options.add_argument('--headless') 
driver = webdriver.Chrome(options=options)

def measure_load_time(url):
    driver.get(url)
    time.sleep(2) 
    timing_data = driver.execute_script(
        "return window.performance.timing"
    )
    load_time = (timing_data['loadEventEnd'] - timing_data['navigationStart']) / 1000.0
    return load_time

game_client_url = ["http://cs455.000.pe/", "http://1cs455.000.pe/", "http://cs455-backup.000.pe/"]
leaderboard_url = "Game/get_scores.php"

for i in game_client_url:
    game_client_load_time = measure_load_time(i)
    leaderboard_load_time = measure_load_time(i+leaderboard_url)

    print(f"{i} Load Time: {game_client_load_time} seconds")
    print(f"{i} Leaderboard Page Load Time: {leaderboard_load_time} seconds")
    print()

driver.quit()
