async function fetchAssetData(items) {
    let symbolList = Object.keys(items).map(item => `"${item}USDT"`);
    try {
        const resp = await fetch(`https://api.binance.com/api/v1/ticker/24hr?symbols=[${symbolList.join(",")}]`);

        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const result = await resp.json();

        for (let i = 0; i < result.length; i++) {
            const itemIndex = result[i].symbol.replace("USDT", "");

            const price = Number(result[i].lastPrice).toFixed(items[itemIndex].roundTo);
            const priceChange = Number(result[i].priceChangePercent).toFixed(2);
            const volume = Number(result[i].volume).toFixed();
            items[itemIndex] = { ...items[itemIndex], price, priceChange, volume };
        }
    } catch (error) {
        console.error("Could not fetch asset data:", error);
    }
}

function renderAssets(parentId, items) {
    const container = document.getElementById(parentId);
    if (!container) {
        console.error(`Element with id '${parentId}' not found.`);
        return;
    }

    let itemsHTML = "";
    for (const itemIndex in items) {
        const item = items[itemIndex];
        itemsHTML += `
      <div class="second-section__coin-block">
          <div class="second-section__coin-asset-block">
              <img class="second-section__coin-asset-block-icon" src="${item.img}" alt="${item.currency}" />
              <div class="second-section__coin-asset-block-text">
                  <div class="second-section__coin-asset-text">${item.currency}</div>
                  <div class="second-section__coin-asset-abbreviation">${itemIndex}</div>
              </div>
          </div>
          <div class="second-section__coin-inf">
              <div class="second-section__coin-price"><span>$</span> ${item.price || ""}</div>
              <div class="second-section__coin-change coin__${Number(item.priceChange) > 0 ? "upsurge" : "downgrade"}">${
            item.priceChange || ""
        } <span class="coin__${Number(item.priceChange) > 0 ? "upsurge" : "downgrade"}">%</span></div>
              <div class="second-section__coin-volume">${item.volume || ""}<span>M</span></div>
              <button class="second-section__coin-trade-button">Trade</button>
         </div>
      </div>`;
    }

    container.innerHTML = itemsHTML;
}

const AssetsList = {
    "1INCH": {
        img: "./assets/1inch.png",
        currency: "1inch",
        roundTo: 2
    },
    BTC: {
        img: "./assets/bitcoin.png",
        currency: "Bitcoin",
        roundTo: 0
    },
    ETH: {
        img: "./assets/ethereum.png",
        currency: "Ethereum",
        roundTo: 0
    },
    BNB: {
        img: "./assets/binance.png",
        currency: "Binance coin",
        roundTo: 0
    },
    BUSD: {
        img: "./assets/binance-usd.png",
        currency: "Binance USD",
        roundTo: 2
    },
    MATIC: {
        img: "./assets/polygon.png",
        currency: "Polygon",
        roundTo: 2
    }
};

async function initAssetTable() {
    const parentId = "second-section__value";
    let assets = { ...AssetsList };
    await fetchAssetData(assets);
    renderAssets(parentId, assets);
}

initAssetTable();
