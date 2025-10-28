import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'main',
                id: 'main',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Item.ability.Type.Main'),
                groups: [
                    { ...groups.main, nestId: 'main_main' },
                    { ...groups.freeStrike, nestId: 'character_free-strike' }
                ]
            },
            {
                nestId: 'maneuver',
                id: 'maneuver',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Item.ability.Type.Maneuver'),
                groups: [
                    { ...groups.maneuver, nestId: 'maneuver_maneuver' },
                    { ...groups.freeManeuver, nestId: 'maneuver_free-maneuver' }
                ]
            },
            {
                nestId: 'triggered',
                id: 'triggered',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Item.ability.Type.Triggered'),
                groups: [
                    { ...groups.triggered, nestId: 'triggered_triggered' },
                    { ...groups.freeTriggered, nestId: 'triggered_free-triggered' }
                ]
            },
            {
                nestId: 'other',
                id: 'other',
                name: coreModule.api.Utils.i18n('tokenActionHud.draw_steel.other'),
                groups: [
                    { ...groups.villain, nestId: 'other_villain' },
                    { ...groups.none, nestId: 'other_none' },
                ]
            },
            {
                nestId: 'features',
                id: 'features',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Actor.Tabs.features'),
                groups: [
                    { ...groups.heroClass, nestId: 'features_heroClass' },
                    { ...groups.ancestry, nestId: 'features_ancestry' },
                    { ...groups.background, nestId: 'features_background' },
                    { ...groups.complication, nestId: 'features_complication' },
                    { ...groups.feature, nestId: 'features_feature' },
                    { ...groups.perk, nestId: 'features_perk' },
                    { ...groups.title, nestId: 'features_title' }
                ]
            },
            {
                nestId: 'equipment',
                id: 'equipment',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Actor.Tabs.equipment'),
                groups: [
                    { ...groups.kit, nestId: 'equipment_kit' },
                    { ...groups.treasure, nestId: 'equipment_treasure' }
                ]
            },
            {
                nestId: 'character',
                id: 'character',
                name: coreModule.api.Utils.i18n('tokenActionHud.draw_steel.character'),
                groups: [
                    { ...groups.characteristic, nestId: 'character_characteristic'},
                    { ...groups.recoveries, nestId: 'character_recoveries' },
                    { ...groups.heroTokens, nestId: 'character_hero-tokens' },
                    { ...groups.respite, nestId: 'character_respite' }
                ]
            },
            {
                nestId: 'projects',
                id: 'projects',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Actor.Tabs.projects'),
                groups: [
                    { ...groups.project, nestId: 'projects_project' }
                ]
            },
            {
                nestId: 'effects',
                id: 'effects',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Actor.Tabs.effects'),
                groups: [
                    { ...groups.effects, nestId: 'effects_effects' },
                    { ...groups.conditions, nestId: 'effects_conditions' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.token, nestId: 'utility_token' },
                    { ...groups.utility, nestId: 'utility_utility' }
                ]
            }
        ],
        groups: groupsArray
    }
})
