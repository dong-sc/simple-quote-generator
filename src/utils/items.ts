import type { QuoteItem } from '../types/quote';

export interface DisplayQuoteItem {
  item: QuoteItem;
  originalIndex: number;
}

interface ItemGroup {
  category: string;
  items: DisplayQuoteItem[];
}

type OrderedEntry =
  | { type: 'group'; group: ItemGroup }
  | { type: 'single'; item: DisplayQuoteItem };

export function getGroupedQuoteItems(items: QuoteItem[]): DisplayQuoteItem[] {
  const orderedEntries: OrderedEntry[] = [];
  const categoryGroups = new Map<string, ItemGroup>();

  items.forEach((item, originalIndex) => {
    const displayItem = { item, originalIndex };
    const category = (item.category || '').trim();

    if (!category) {
      orderedEntries.push({ type: 'single', item: displayItem });
      return;
    }

    const existingGroup = categoryGroups.get(category);
    if (existingGroup) {
      existingGroup.items.push(displayItem);
      return;
    }

    const group = { category, items: [displayItem] };
    categoryGroups.set(category, group);
    orderedEntries.push({ type: 'group', group });
  });

  return orderedEntries.flatMap((entry) =>
    entry.type === 'group' ? entry.group.items : [entry.item],
  );
}

export function formatQuoteItemName(item: QuoteItem, fallbackIndex: number): string {
  return item.name.trim() || `品項 ${fallbackIndex + 1}`;
}

export function formatQuoteItemCategory(item: QuoteItem): string {
  return (item.category || '').trim();
}
