import requests
import random
import string

def generate_random_string(length=11):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def check_url_validity(url):
    try:
        response = requests.get(url)
        if response.url == 'https://events.honorofkings.com/act/a20240529anju/product.html?lang=ID&inviteInfo=blablabla':
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False

def main():
    valid_urls = []
    base_url = 'https://tl.honorofkings.com/v2/tl/29134_1_'

    for _ in range(10000):  # Ubah jumlah iterasi sesuai kebutuhan
        random_string = generate_random_string()
        full_url = base_url + random_string
        if check_url_validity(full_url):
            valid_urls.append(full_url)
            print(f"Valid URL found: {full_url}")
    
    with open('valid_urls.txt', 'w') as file:
        for url in valid_urls:
            file.write(url + '\n')
    
    print("Finished checking URLs. Valid URLs saved to valid_urls.txt")

if __name__ == '__main__':
    main()
