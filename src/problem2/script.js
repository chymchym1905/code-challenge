document.getElementById('currencyExchangeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    alert(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);
    // Add your conversion logic here or send data to a server for processing
});

function toggleMenu() {
    const submenu = document.getElementById('subMenu');
    submenu.classList.toggle('open');
    const button = document.getElementById('arrow');
    button.classList.toggle('rotate');
}
