// VicinLiveActivity.swift
// Native iOS ActivityKit SwiftUI Implementation for Lock Screen & Dynamic Island

import ActivityKit
import WidgetKit
import SwiftUI

public struct VicinActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        public var expiresAt: Date
        public var ackCount: Int
        public var status: String
    }

    public var broadcastId: String
    public var groupName: String
    public var activityName: String
    public var activityEmoji: String
}

@main
struct VicinWidgetBundle: WidgetBundle {
    var body: some Widget {
        VicinLiveActivity()
        VicinFeedWidget()
    }
}

struct VicinLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: VicinActivityAttributes.self) { context in
            // Lock Screen Banner
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "10B981").opacity(0.15))
                        .frame(width: 44, height: 44)
                    Text(context.attributes.activityEmoji)
                        .font(.system(size: 24))
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(context.attributes.activityName)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                    Text(context.attributes.groupName)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(timerInterval: Date()...context.state.expiresAt, countsDown: true)
                        .font(.system(size: 14, weight: .semibold, design: .monospaced))
                        .foregroundColor(Color(hex: "10B981"))
                    Text("\(context.state.ackCount) in")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .activityBackgroundTint(Color(hex: "090A0F"))
            .activitySystemActionForegroundColor(Color(hex: "10B981"))

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded Dynamic Island
                DynamicIslandExpandedRegion(.leading) {
                    HStack {
                        Text(context.attributes.activityEmoji)
                            .font(.title2)
                        VStack(alignment: .leading) {
                            Text(context.attributes.activityName)
                                .font(.headline)
                            Text(context.attributes.groupName)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing) {
                        Text(timerInterval: Date()...context.state.expiresAt, countsDown: true)
                            .font(.headline)
                            .foregroundColor(Color(hex: "10B981"))
                        Text("\(context.state.ackCount) joined")
                            .font(.caption2)
                    }
                }
            } compactLeading: {
                Text(context.attributes.activityEmoji)
            } compactTrailing: {
                Text(timerInterval: Date()...context.state.expiresAt, countsDown: true)
                    .font(.caption2)
                    .foregroundColor(Color(hex: "10B981"))
            } minimal: {
                Text(context.attributes.activityEmoji)
            }
        }
    }
}

// Home Screen Feed Widget
struct VicinFeedWidget: Widget {
    let kind: String = "VicinFeedWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VicinTimelineProvider()) { entry in
            VicinFeedWidgetView(entry: entry)
                .containerBackground(Color(hex: "090A0F"), for: .widget)
        }
        .configurationDisplayName("Neighborhood Availability")
        .description("Quickly check if anyone is free in your group.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct VicinTimelineEntry: TimelineEntry {
    let date: Date
    let activeCount: Int
    let latestActivity: String
    let latestEmoji: String
    let broadcasterName: String
}

struct VicinTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> VicinTimelineEntry {
        VicinTimelineEntry(date: Date(), activeCount: 2, latestActivity: "Coffee Break", latestEmoji: "☕", broadcasterName: "Bob")
    }

    func getSnapshot(in context: Context, completion: @escaping (VicinTimelineEntry) -> Void) {
        completion(placeholder(in: context))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<VicinTimelineEntry>) -> Void) {
        let entry = placeholder(in: context)
        let timeline = Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(15 * 60)))
        completion(timeline)
    }
}

struct VicinFeedWidgetView: View {
    var entry: VicinTimelineEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Circle()
                    .fill(Color(hex: "10B981"))
                    .frame(width: 8, height: 8)
                Text("VICIN PULSE")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "10B981"))
                Spacer()
            }

            Spacer()

            if entry.activeCount > 0 {
                HStack(spacing: 8) {
                    Text(entry.latestEmoji)
                        .font(.system(size: 28))
                    VStack(alignment: .leading) {
                        Text(entry.latestActivity)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                        Text(entry.broadcasterName)
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                }
            } else {
                Text("Neighborhood is quiet")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "94A3B8"))
            }

            Spacer()

            Text("\(entry.activeCount) active now")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(Color(hex: "64748B"))
        }
        .padding()
    }
}

extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)
        let r = Double((rgbValue & 0xFF0000) >> 16) / 255.0
        let g = Double((rgbValue & 0x00FF00) >> 8) / 255.0
        let b = Double(rgbValue & 0x0000FF) / 255.0
        self.init(red: r, green: g, blue: b)
    }
}
