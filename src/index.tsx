import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import React from "react";

const Wareki = {
  reiwa: { start: 2019, label: "令和", prefixes: ["令和", "令", "R"] },
  heisei: { start: 1989, label: "平成", prefixes: ["平成", "平", "H"] },
  showa: { start: 1926, label: "昭和", prefixes: ["昭和", "昭", "S"] },
  taisho: { start: 1912, label: "大正", prefixes: ["大正", "大", "T"] },
  meiji: { start: 1868, label: "明治", prefixes: ["明治", "明", "M"] },
};

type WarekiKey = keyof typeof Wareki;

const calcWareki = (searchYear: number) => {
  return Object.keys(Wareki).reduce(
    (prev, current) => {
      const { start, label } = Wareki[current as WarekiKey];
      if (searchYear < start) return prev;

      return [...prev, `${label}${searchYear - start + 1}年`];
    },
    [`西暦${searchYear}年`]
  );
};

const warekiExtractRegex;

const convertYear = (searchYear: string) => {
  const result = NaN;

  // 西暦
  if (Number(searchYear) > 0) {
    return Number(searchYear);
  }

  // 和暦は 開始+year-1

  return result;
};

// 数値は西暦
//
// 各年号は以下のように扱う
// M,明治,明
// T,大正,大
// S,昭和,昭
// H,平成,平
// R,令和,令
// 入力
//    2019, 2019年
//    H31, 平成31, 平31
// 出力
//    西暦2019年
//    令和1年
//    平成31年
//    昭和97年
//    大正111年
//    明治155年
export default function Command() {
  const [searchYear, setSearchYear] = React.useState("");

  const year = convertYear(searchYear);
  const items = isNaN(year) ? [] : calcWareki(year);

  return (
    <List
      isLoading={items.length === 0}
      searchBarPlaceholder="Enter year of AD or 和暦"
      enableFiltering={false}
      onSearchTextChange={setSearchYear}
    >
      {items.map((item) => {
        return (
          <List.Item
            key={item}
            title={item}
            actions={<Actions item={item} />}
            icon={{ source: Icon.Circle, tintColor: Color.Green }}
          />
        );
      })}
    </List>
  );
}

function Actions({ item }: { item: string }) {
  return (
    <ActionPanel title="Wareki - 和暦">
      <Action.CopyToClipboard content={item} title="Copy" />
    </ActionPanel>
  );
}
