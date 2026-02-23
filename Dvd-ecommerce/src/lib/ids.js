import { readJson, writeJson } from './storage.js'

const ORDER_SEQ_KEY = 'dvd.orderSeq'

export function nextOrderId() {
  const seq = readJson(ORDER_SEQ_KEY, 0) + 1
  writeJson(ORDER_SEQ_KEY, seq)
  return `ORD-${String(seq).padStart(6, '0')}`
}

