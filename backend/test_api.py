#!/usr/bin/env python3
"""
Script test API từ máy tính
"""

import requests

def test_api():
    try:
        print('🔍 Testing API from local machine...')
        response = requests.get('http://192.168.1.3:8000/api/guests/1')
        print(f'Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'Guest name: {data.get("name")}')
            print(f'Guest ID: {data.get("id")}')
            print('✅ API hoạt động tốt!')
        else:
            print(f'❌ Error: {response.text}')
    except Exception as e:
        print(f'❌ Exception: {e}')

if __name__ == "__main__":
    test_api()




