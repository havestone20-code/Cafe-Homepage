import { db } from './firebase-config.js';
import {
  collection, addDoc, onSnapshot,
  query, orderBy, deleteDoc, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ordersCol = collection(db, 'orders');

// 주문 저장 (Firestore)
window.addOrder = async function(name, btn) {
  const control = btn.closest('.order-control');
  const qtySpan = control.querySelector('.qty-value');
  const qty = parseInt(qtySpan.textContent, 10);
  try {
    await addDoc(ordersCol, { name, qty, time: serverTimestamp() });
    qtySpan.textContent = '1';
    window.showToast('☕ ' + name + ' ' + qty + '잔 주문이 접수되었습니다');
  } catch (e) {
    window.showToast('⚠️ 주문 저장에 실패했습니다');
  }
};

// 전체 주문 삭제 (Firestore)
window.clearOrders = async function() {
  if (!confirm('모든 주문 내역을 삭제할까요?')) return;
  const snap = await getDocs(ordersCol);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
};

// 주문현황 탭 진입 시 호출
window.renderOrders = function() {
  getDocs(query(ordersCol, orderBy('time', 'asc'))).then(snap => {
    renderOrdersUI(snap.docs.map(toOrder));
  });
};

// 실시간 자동 업데이트 (주문현황 탭이 열려 있으면 즉시 반영)
onSnapshot(query(ordersCol, orderBy('time', 'asc')), snap => {
  const page = document.getElementById('orders');
  if (page && page.classList.contains('active')) {
    renderOrdersUI(snap.docs.map(toOrder));
  }
});

function toOrder(doc) {
  const d = doc.data();
  return {
    name: d.name,
    qty: d.qty,
    time: d.time?.toDate?.()?.toISOString() || new Date().toISOString()
  };
}

function renderOrdersUI(orders) {
  const box = document.getElementById('orders-content');
  if (!box) return;

  if (!orders.length) {
    box.innerHTML = '<div class="orders-empty">☕ 아직 접수된 주문이 없습니다.<br>'
      + '<a onclick="showPage(\'menu\')" style="color:var(--dark-wood);cursor:pointer;border-bottom:1px solid var(--dark-wood);">메뉴 페이지</a>에서 음료를 주문해 보세요.</div>';
    return;
  }

  const totalCups = orders.reduce((s, o) => s + o.qty, 0);
  let rows = '';
  for (let i = orders.length - 1; i >= 0; i--) {
    const o = orders[i];
    rows += '<div class="orders-row">'
      + '<span class="od-no">' + (i + 1) + '</span>'
      + '<span class="od-menu">' + o.name + '</span>'
      + '<span class="od-qty"><b>' + o.qty + '</b>잔</span>'
      + '<span class="od-time">' + window.formatOrderTime(o.time) + '</span>'
      + '</div>';
  }

  box.innerHTML =
    '<div class="orders-summary">'
    + '<div class="orders-count">총 <b>' + orders.length + '</b>건 주문 · <b>' + totalCups + '</b>잔</div>'
    + '<button class="orders-clear" onclick="clearOrders()">주문 내역 비우기</button>'
    + '</div>'
    + '<div class="orders-table">'
    + '<div class="orders-row head"><span>No.</span><span>주문메뉴</span><span>수량</span><span style="text-align:right;">주문시간</span></div>'
    + rows
    + '</div>';
}
