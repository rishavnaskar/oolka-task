import React from "react";
import { SectionListData, StyleProp, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";

import { SearchBarProps, TaskItemType, ThemeColorPaletteType } from "@/src/utils/types";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export const TasksListEmptyComponent = ({ containerStyle, textStyle }:
    { containerStyle: StyleProp<ViewStyle>, textStyle: StyleProp<TextStyle> }
) => <View style={containerStyle}>
        <Text style={textStyle}>No tasks found!</Text>
    </View>

export const TasksListRenderSectionHeader = ({
    section: { title, data },
    sectionListHeaderContainer,
    sectionListHeaderText,
    theme
}: {
    section: SectionListData<TaskItemType, {
        title: string;
        data: TaskItemType[];
    }>,
    sectionListHeaderContainer: StyleProp<ViewStyle>,
    sectionListHeaderText: StyleProp<TextStyle>,
    theme: ThemeColorPaletteType | null
}) => data.length > 0 ?
        <View style={sectionListHeaderContainer}>
            <MaterialCommunityIcons name='label-outline' size={24} color={theme?.subTextColor} />
            <Text style={sectionListHeaderText}>{title}</Text>
        </View>
        : null

export const TasksListHeaderComponent = ({
    searchBarProps,
    searchBarContainer,
    searchBar,
    theme,
    onChangeSearchText
}: {
    searchBarProps: SearchBarProps
    searchBarContainer: StyleProp<ViewStyle>,
    searchBar: StyleProp<TextStyle>,
    theme: ThemeColorPaletteType | null,
    onChangeSearchText: (val: string) => void
}) => searchBarProps.isVisible ? <View style={searchBarContainer}>
    <MaterialCommunityIcons name='magnify' size={20} color={theme?.iconColor} />
    <TextInput
        style={searchBar}
        placeholder='Start typing...'
        value={searchBarProps.searchText}
        onChangeText={onChangeSearchText}
        placeholderTextColor={theme?.headerColor}
    />
    <MaterialCommunityIcons name='close-circle-outline' size={20} color={theme?.iconColor} onPress={() => onChangeSearchText('')} />
</View> : null