document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, JavaScript is running!');

  const tableBody = document.getElementById('table-body');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentPage = 1;
  const perPage = 10;
  let allData = [];

  const formatNumber = (num) => num.toFixed(2).replace(',', '.');

  const fetchCryptoData = async () => {
    try {
      const res = await fetch('https://corsproxy.io/?https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en');
      allData = await res.json();
      renderTable();
      updateButtons();
    } catch (err) {
      console.error('Failed to fetch crypto data:', err);
      tableBody.innerHTML = `<tr><td colspan="3">Failed to load data</td></tr>`;
    }
  };

  const renderTable = () => {
    tableBody.innerHTML = allData
      .slice((currentPage - 1) * perPage, currentPage * perPage)
      .map(coin => `
        <tr>
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
              <span>${formatNumber(coin.current_price)}</span>
              <div class="price-change">
                <span class="high">H: ${formatNumber(coin.high_24h)}</span>
                <span class="low">L: ${formatNumber(coin.low_24h)}</span> 
              </div>
            </section>
          </td>
          <td class="market-cap-cell">${coin.market_cap.toLocaleString()}</td>
        </tr>
      `).join('');
  };

  const updateButtons = () => {
    backBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * perPage >= allData.length;
  };

  backBtn.addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    renderTable();
    updateButtons();
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage * perPage < allData.length) currentPage++;
    renderTable();
    updateButtons();
  });

  fetchCryptoData();
});
