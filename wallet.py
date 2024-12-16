import requests
import json

def get_wallet_balance(wallet_address):
    """
    Fetch the wallet balance from vanascan.io API.

    Args:
        wallet_address (str): The wallet address to check.

    Returns:
        dict: A dictionary containing the wallet address and its balance or error.
    """
    url = f"https://vanascan.io/api/wallet/{wallet_address}"  # Hypothetical API endpoint

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                "wallet": wallet_address,
                "balance": data.get("balance", "Unknown")
            }
        else:
            return {
                "wallet": wallet_address,
                "error": f"Failed with status code {response.status_code}"
            }
    except Exception as e:
        return {
            "wallet": wallet_address,
            "error": str(e)
        }

if __name__ == "__main__":
    # List of wallet addresses to check
    wallet_addresses = [
        "0x0d9D0278Fb0D07e7337c0D9f1F839A471885973c",
        "0x5F4254Ce2A8b4fe3ce62d83e6ab55Eb3eCb5cB06",
        "0xEC468188975E8B1586C76de93A75066638527752"
      "0xC75DD44517E6b5aF1fa2762167D604c407447E4b"
      "0x8129a0bCA8D57677C4381571B9323C720C52Ab5b"
      "0xe5eFE97f75e92d6C65d58BFeE666962FEB822ab8"
      "0xe94Df0fE17E584D66cC51446F1D7521f67abd446"
      "0x94BCa4915b3C33d5127A5BC3B19c5Ff12596508b"
      "0xBfcDC58CE0828c876915240eD3Bd29c2B95b1E34"
      "0x890C47b11289597fc3E59718485e956b937517E8"
      "0x8E45a21878c5bD2D559ca8851C776c35df6444cf"
      "0x53EC66B1448d4BE16Ed74102E6B94809ff7d9554"
      "0x8082A0645065B4f325Cb0F879d9E357549d7698d"
      "0x73278C0C2C4004583c1ef2A44c1fff70eeD12133"
      "0x8c362F10De0590b2ea2Df76e260dB0f37DeC9b70"
      "0xB922A3d852c18DA05900FFE6ecb26064796B0eA3"
      "0x3568dd1C9c8c9C8BcC068F19bCE876b91394a87a"
      
      
      
    ]

    results = []

    for wallet in wallet_addresses:
        result = get_wallet_balance(wallet)
        results.append(result)

    # Print the results
    print("Wallet Balances:")
    for res in results:
        print(json.dumps(res, indent=2))

    # Optionally save results to a file
    with open("wallet_balances.json", "w") as f:
        json.dump(results, f, indent=2)
        print("Results saved to wallet_balances.json")
