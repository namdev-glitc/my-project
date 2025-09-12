#!/usr/bin/env python3
"""
Script test API từ mobile IP
"""

import requests

def test_mobile_api():
    try:
        print('🔍 Testing API from mobile IP...')
        response = requests.get('http://192.168.1.3:8000/api/guests/1')
        print(f'Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'Guest name: {data.get("name")}')
            print('✅ API accessible from mobile IP!')
        else:
            print(f'❌ Error: {response.text}')
    except Exception as e:
        print(f'❌ Exception: {e}')

if __name__ == "__main__":
    test_mobile_api()




