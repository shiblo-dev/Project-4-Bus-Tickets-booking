let selectedseat = [];
let Bookedseat = [];

const TOTAL_SEATS = 40;
const SEAT_PRICE = 550;

let discount = 0;
let appliedCoupon = "";

const Availableseat = document.getElementById("Aseats");
if (Availableseat) Availableseat.innerText = TOTAL_SEATS;

function handleClick(id) {
  const btn = document.getElementById(id);
  if (btn.disabled) return;

  if (!selectedseat.includes(id) && selectedseat.length >= 4) {
    alert("Maximum 4 seats allowed");
    return;
  }

  if (selectedseat.includes(id)) {
    selectedseat = selectedseat.filter((s) => s !== id);
    btn.classList.remove("bg-green-500", "text-white");
    btn.classList.add("bg-gray-200");
  } else {
    selectedseat.push(id);
    btn.classList.remove("bg-gray-200");
    btn.classList.add("bg-green-500", "text-white");
  }

  discount = 0;
  appliedCoupon = "";
  document.getElementById("couponMsg").innerText = "";
  document.getElementById("couponInput").value = "";

  showdata();
}
function showdata() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  selectedseat.forEach((seat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center">${seat}</td>
      <td class="text-center">Economy</td>
      <td class="text-center">${SEAT_PRICE}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("Sseat").innerText = selectedseat.length;

  const total = selectedseat.length * SEAT_PRICE;
  const payable = total - discount;

  document.getElementById("booking").innerHTML = `
    <h1 class="font-bold my-2">Total: ${total} Tk</h1>
    ${
      discount > 0
        ? `<h1 class="text-green-600 font-bold">
             Discount (${appliedCoupon}): -${discount} Tk
           </h1>
           <h1 class="font-bold">Payable: ${payable} Tk</h1>`
        : ""
    }
  `;

  document
    .getElementById("passengerForm")
    .classList.toggle("hidden", selectedseat.length === 0);

  document
    .getElementById("couponArea")
    .classList.toggle("hidden", selectedseat.length === 0);
}
document.getElementById("purchasebtn").addEventListener("click", handleBook);

function handleBook(e) {
  e.preventDefault();

  const names = document.getElementById("pName").value.trim();
  const mobile = document.getElementById("pMobile").value.trim();

  if (!names) {
    alert("Passenger name is required");
    return;
  }
  if (!/^01\d{9}$/.test(mobile)) {
    alert("Enter valid 11 digit Bangladeshi mobile number");
    return;
  }
  document.getElementById("modalSeats").innerText =
    "Seats: " + selectedseat.join(", ");

  const total = selectedseat.length * SEAT_PRICE;
  const payable = total - discount;

  document.getElementById("modalAmount").innerText =
    "Paid Amount: " + payable + " Tk";

  document.getElementById("successModal").showModal();

  selectedseat.forEach((s) => {
    const btn = document.getElementById(s);
    btn.disabled = true;
    btn.classList.remove("bg-green-500");
    btn.classList.add("bg-gray-700", "text-white");
  });

  Bookedseat.push(...selectedseat);

  if (Availableseat) {
    Availableseat.innerText = TOTAL_SEATS - Bookedseat.length;
  }

  selectedseat = [];
  discount = 0;
  appliedCoupon = "";
  document.getElementById("couponInput").value = "";
  document.getElementById("couponMsg").innerText = "";
  document.getElementById("passengerForm").reset();

  showdata();
}
document.getElementById("applyCoupon").addEventListener("click", function () {
  const code = document
    .getElementById("couponInput")
    .value.trim()
    .toUpperCase();
  const msg = document.getElementById("couponMsg");

  const total = selectedseat.length * SEAT_PRICE;
  discount = 0;
  appliedCoupon = "";

  if (selectedseat.length === 0) {
    msg.innerText = "Please select seat first";
    msg.className = "text-red-500";
    return;
  }

  if (code === "COUPLE20") {
    if (selectedseat.length === 2) {
      discount = Math.round(total * 0.2);
      appliedCoupon = "COUPLE20";
      msg.innerText = "COUPLE20 applied (20% OFF)";
      msg.className = "text-green-600";
    } else {
      msg.innerText = "COUPLE20 valid only for 2 seats";
      msg.className = "text-red-500";
    }
  } else if (code === "NEW15") {
    discount = Math.round(total * 0.15);
    appliedCoupon = "NEW15";
    msg.innerText = "NEW15 applied (15% OFF)";
    msg.className = "text-green-600";
  } else {
    msg.innerText = "Invalid coupon code";
    msg.className = "text-red-500";
  }

  showdata();
});
