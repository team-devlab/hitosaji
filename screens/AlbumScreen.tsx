import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Bookmark = {
  id: string;
  date: string;
  message: string;
};

type Props = {
  onNavigateHello: () => void;
};

const DUMMY_BOOKMARKS: Bookmark[] = [
  { id: "1", date: "2026-05-03", message: "駅前の立ち食いそば。ネギ多め。" },
  { id: "2", date: "2026-05-02", message: "深夜のカップ麺。罪悪感すごいけど最高。" },
  { id: "3", date: "2026-05-01", message: "少し焦げた卵焼き。朝はこれで十分。" },
  { id: "4", date: "2026-04-29", message: "スーパーの半額シール弁当、助かった。" },
  { id: "5", date: "2026-04-25", message: "実家の肉じゃが。母の味付けが少し変わっていた。" },
  { id: "6", date: "2026-04-20", message: "コンビニのおにぎり。鮭、やっぱり一番。" },
  { id: "7", date: "2026-03-30", message: "桜の下でおにぎり。風が強くて少し寒かった。" },
];

type MonthGroup = { month: string; items: Bookmark[] };

function groupByMonth(bookmarks: Bookmark[]): MonthGroup[] {
  const sorted = [...bookmarks].sort((a, b) => b.date.localeCompare(a.date));
  const groups: MonthGroup[] = [];
  for (const bookmark of sorted) {
    const month = bookmark.date.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.month === month) {
      last.items.push(bookmark);
    } else {
      groups.push({ month, items: [bookmark] });
    }
  }
  return groups;
}

function formatMonth(month: string): string {
  const [year, rawMonth] = month.split("-");
  return `${year} 年 ${Number(rawMonth)} 月`;
}

function formatDay(date: string): string {
  const [, rawMonth, rawDay] = date.split("-");
  return `${Number(rawMonth)}/${Number(rawDay)}`;
}

export default function AlbumScreen({ onNavigateHello }: Props) {
  const groups = groupByMonth(DUMMY_BOOKMARKS);
  const count = DUMMY_BOOKMARKS.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>しおり</Text>
          <Text style={styles.subtitle}>{count} 件</Text>
        </View>

        {groups.map(({ month, items }) => (
          <View key={month} style={styles.monthGroup}>
            <Text style={styles.monthHeader}>{formatMonth(month)}</Text>
            {items.map((bookmark) => (
              <View key={bookmark.id} style={styles.card}>
                <Text style={styles.date}>{formatDay(bookmark.date)}</Text>
                <Text style={styles.message}>{bookmark.message}</Text>
              </View>
            ))}
          </View>
        ))}

        <Pressable onPress={onNavigateHello} style={styles.linkButton}>
          <Text style={styles.linkText}>Hello World 画面に戻る</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingHorizontal: 32,
    paddingTop: 64,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2A44",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#7B8CAE",
  },
  monthGroup: {
    marginBottom: 24,
  },
  monthHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B6478",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#F7F9FC",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#7E8AAB",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  date: {
    fontSize: 13,
    color: "#7B8CAE",
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: "#1F2A44",
    lineHeight: 22,
  },
  linkButton: {
    alignItems: "center",
    marginTop: 24,
  },
  linkText: {
    color: "#7B8CAE",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
