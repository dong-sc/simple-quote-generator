import type { QuoteData, QuoteItem } from '../types/quote';
import { calculateItemSubtotal } from '../utils/calculation';
import { formatCurrency, parseNumberInput } from '../utils/currency';
import { createEmptyItem } from '../utils/defaultQuote';

interface QuoteItemsEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
}

export function QuoteItemsEditor({ data, onChange }: QuoteItemsEditorProps) {
  function updateItem(id: string, patch: Partial<QuoteItem>) {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  }

  function addItem() {
    onChange({ ...data, items: [...data.items, createEmptyItem()] });
  }

  function removeItem(id: string) {
    const nextItems = data.items.filter((item) => item.id !== id);
    onChange({ ...data, items: nextItems.length > 0 ? nextItems : [createEmptyItem()] });
  }

  return (
    <section className="form-section">
      <div className="section-title-row">
        <h2>報價項目</h2>
        <button className="button small" type="button" onClick={addItem}>
          新增品項
        </button>
      </div>
      <div className="items-editor">
        {data.items.map((item, index) => (
          <article className="item-card" key={item.id}>
            <div className="item-card-header">
              <strong>品項 {index + 1}</strong>
              <button
                className="text-button danger"
                type="button"
                onClick={() => removeItem(item.id)}
              >
                刪除
              </button>
            </div>
            <div className="field-grid item-grid">
              <label className="wide-field">
                品項名稱
                <input
                  value={item.name}
                  onChange={(event) => updateItem(item.id, { name: event.target.value })}
                />
              </label>
              <label>
                數量
                <input
                  min="0"
                  type="number"
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(item.id, {
                      quantity: parseNumberInput(event.target.value),
                    })
                  }
                />
              </label>
              <label>
                單位
                <input
                  value={item.unit}
                  onChange={(event) => updateItem(item.id, { unit: event.target.value })}
                  placeholder="式"
                />
              </label>
              <label>
                單價
                <input
                  min="0"
                  type="number"
                  value={item.unitPrice}
                  onChange={(event) =>
                    updateItem(item.id, {
                      unitPrice: parseNumberInput(event.target.value),
                    })
                  }
                />
              </label>
              <label className="wide-field">
                說明
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(event) =>
                    updateItem(item.id, { description: event.target.value })
                  }
                />
              </label>
            </div>
            <p className="item-subtotal">
              小計 {formatCurrency(calculateItemSubtotal(item), data.currency)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
