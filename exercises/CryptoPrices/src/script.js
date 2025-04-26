document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, JavaScript is running!');

  const tableBody = document.getElementById('table-body');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentPage = 1;
  const perPage = 10;

  function formatNumber(number) {
    return number.toFixed(2).replace(',', '.');
  }

  async function fetchCryptoData(page = 1) {
    const url = `https://corsproxy.io/?https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&locale=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      renderTable(data);

      backBtn.disabled = currentPage === 1;
      nextBtn.disabled = data.length < perPage;
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      tableBody.innerHTML = `<tr><td colspan="3">Failed to load data</td></tr>`;
    }
  }

  function renderTable(coins) {
    tableBody.innerHTML = '';
    coins.forEach((coin) => {
      const currentPrice = formatNumber(coin.current_price);
      const high24h = formatNumber(coin.high_24h);
      const low24h = formatNumber(coin.low_24h);

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <section class="coin-cell">
            <img src="${coin.image}" alt="${coin.name}" class="coin-icon">
            <div class="coin-title-wrapper">
              <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
              <span class="coin-name">${coin.name}</span>
            </div>
          </section>
        </td>
        <td>
          <section class="price-cell">
            <span>${currentPrice}</span>
            <div class="price-change">
              <span class="high">H: ${high24h}</span>
              <span class="low">L: ${low24h}</span> 
            </div>
          </section>
        </td>
        <td class="market-cap-cell">${coin.market_cap.toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  backBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchCryptoData(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchCryptoData(currentPage);
  });

  fetchCryptoData();
});
