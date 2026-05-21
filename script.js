let menu = JSON.parse(localStorage.getItem("menu")) || [
  {
    nama: "Nasi Goreng",
    harga: 25000,
    kategori: "Makanan"
  },
  {
    nama: "Mie Ayam",
    harga: 20000,
    kategori: "Makanan"
  },
  {
    nama: "Es Teh",
    harga: 10000,
    kategori: "Minuman"
  },
  {
    nama: "Jus Jeruk",
    harga: 15000,
    kategori: "Minuman"
  }
];

let pesanan = [];

function simpanMenu() {
  localStorage.setItem("menu", JSON.stringify(menu));
}

function renderMenu() {

  const menuList = document.getElementById("menu-list");
  const menuSelect = document.getElementById("menuSelect");

  menuList.innerHTML = "";
  menuSelect.innerHTML = "";

  menu.forEach((item, index) => {

    menuList.innerHTML += `
      <div class="menu-item">

        <div>
          <strong>${item.nama}</strong><br>
          ${item.kategori}<br>
          Rp ${item.harga.toLocaleString()}
        </div>

        <div>
          <button onclick="editMenu(${index})">
            Edit
          </button>

          <button onclick="hapusMenu(${index})">
            Hapus
          </button>
        </div>

      </div>
    `;

    menuSelect.innerHTML += `
      <option value="${index}">
        ${item.nama} - Rp ${item.harga.toLocaleString()}
      </option>
    `;
  });
}

function tambahPesanan() {

  const menuIndex = document.getElementById("menuSelect").value;
  const qty = parseInt(document.getElementById("qty").value);

  if (qty <= 0 || isNaN(qty)) {
    alert("Jumlah pesanan tidak valid!");
    return;
  }

  pesanan.push({
    item: menu[menuIndex],
    qty: qty
  });

  renderPesanan();

  document.getElementById("qty").value = "";
}

function renderPesanan() {

  const orderList = document.getElementById("order-list");

  orderList.innerHTML = "";

  pesanan.forEach((p) => {

    orderList.innerHTML += `
      <div class="order-item">
        <div>
          ${p.item.nama} (${p.qty}x)
        </div>

        <div>
          Rp ${(p.item.harga * p.qty).toLocaleString()}
        </div>
      </div>
    `;
  });
}

function checkout() {

  if (pesanan.length === 0) {
    alert("Belum ada pesanan!");
    return;
  }

  let subtotal = 0;
  let diskon = 0;
  let promoMinuman = 0;

  let detail = "";

  pesanan.forEach((p) => {

    const total = p.item.harga * p.qty;

    subtotal += total;

    detail += `
      <p>
        ${p.item.nama} (${p.qty}x) = Rp ${total.toLocaleString()}
      </p>
    `;

    if (p.item.kategori === "Minuman" && subtotal > 50000) {

      const gratis = Math.floor(p.qty / 2);

      promoMinuman += gratis * p.item.harga;
    }
  });

  if (subtotal > 100000) {
    diskon = subtotal * 0.10;
  }

  const pajak = subtotal * 0.10;
  const service = 5000;

  const totalBayar = subtotal + pajak + service - diskon - promoMinuman;

  document.getElementById("receipt").innerHTML = `

    <div class="receipt-box">

      <h3>STRUK PEMBAYARAN</h3>
      <hr>

      ${detail}

      <hr>

      <p>Subtotal : Rp ${subtotal.toLocaleString()}</p>
      <p>Pajak 10% : Rp ${pajak.toLocaleString()}</p>
      <p>Biaya Pelayanan : Rp ${service.toLocaleString()}</p>
      <p>Diskon 10% : Rp ${diskon.toLocaleString()}</p>
      <p>Promo Minuman : Rp ${promoMinuman.toLocaleString()}</p>

      <hr>

      <h2>Total Bayar : Rp ${totalBayar.toLocaleString()}</h2>

    </div>
  `;
}

function tambahMenu() {

  const nama = document.getElementById("newName").value.trim();
  const harga = parseInt(document.getElementById("newPrice").value);
  const kategori = document.getElementById("newCategory").value;

  if (nama === "" || isNaN(harga) || harga <= 0) {
    alert("Input menu tidak valid!");
    return;
  }

  menu.push({
    nama,
    harga,
    kategori
  });

  simpanMenu();
  renderMenu();

  document.getElementById("newName").value = "";
  document.getElementById("newPrice").value = "";

  alert("Menu berhasil ditambahkan!");
}

function editMenu(index) {

  const yakin = confirm("Yakin ingin mengubah menu ini?");

  if (!yakin) {
    return;
  }

  const namaBaru = prompt("Masukkan nama menu baru:", menu[index].nama);

  if (!namaBaru) {
    alert("Perubahan dibatalkan!");
    return;
  }

  const hargaBaru = prompt("Masukkan harga baru:", menu[index].harga);

  if (isNaN(hargaBaru) || hargaBaru <= 0) {
    alert("Harga tidak valid!");
    return;
  }

  menu[index].nama = namaBaru;
  menu[index].harga = parseInt(hargaBaru);

  simpanMenu();
  renderMenu();

  alert("Menu berhasil diubah!");
}

function hapusMenu(index) {

  const yakin = confirm(
    `Yakin ingin menghapus ${menu[index].nama}?`
  );

  if (yakin) {

    menu.splice(index, 1);

    simpanMenu();
    renderMenu();

    alert("Menu berhasil dihapus!");
  }
}

renderMenu();