import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { formatDay, formatMonth } from "../lib/date";
import { Bookmark, useBookmarks } from "../lib/store/bookmarks";

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

export default function AlbumScreen() {
  const bookmarks = useBookmarks((s) => s.bookmarks);
  const groups = groupByMonth(bookmarks);
  const count = bookmarks.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>しおり</Text>
          <Text style={styles.subtitle}>{count} 件</Text>
        </View>

        {count === 0 ? (
          <Text style={styles.empty}>まだしおりはありません</Text>
        ) : (
          groups.map(({ month, items }) => (
            <View key={month} style={styles.monthGroup}>
              <Text style={styles.monthHeader}>{formatMonth(month)}</Text>
              {items.map((bookmark) => (
                <View key={bookmark.id} style={styles.card}>
                  <Text style={styles.date}>{formatDay(bookmark.date)}</Text>
                  <Text style={styles.message}>{bookmark.message}</Text>
                </View>
              ))}
            </View>
          ))
        )}

        <Pressable onPress={() => router.back()} style={styles.linkButton}>
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
  empty: {
    marginTop: 48,
    fontSize: 14,
    color: "#7B8CAE",
    textAlign: "center",
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
