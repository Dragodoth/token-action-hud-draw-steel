/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-draw-steel'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0.16'

/**
 * Action types
 */
export const ACTION_TYPE = {
    item: 'tokenActionHud.draw_steel.Item',
    characteristic: 'DRAW_STEEL.Actor.base.FIELDS.characteristics.label',
    conditions: 'DRAW_STEEL.ActiveEffect.StatusConditions',
    heroTokens: 'DRAW_STEEL.Setting.HeroTokens.Label',
    recoveries: 'DRAW_STEEL.Actor.base.FIELDS.recoveries.label',
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {
    main: { id: 'main', name: 'DRAW_STEEL.Item.ability.Type.Main', type: 'system' },
    maneuver: { id: 'maneuver', name: 'DRAW_STEEL.Item.ability.Type.Maneuver', type: 'system' },
    freeManeuver: { id: 'free-maneuver', name: 'DRAW_STEEL.Item.ability.Type.FreeManeuver', type: 'system' },
    triggered: { id: 'triggered', name: 'DRAW_STEEL.Item.ability.Type.Triggered', type: 'system' },
    freeTriggered: { id: 'free-triggered', name: 'DRAW_STEEL.Item.ability.Type.FreeTriggered', type: 'system' },
    villain: { id: 'villain', name: 'DRAW_STEEL.Item.ability.Type.Villain', type: 'system' },
    
    signature: { id: 'signature', name: 'DRAW_STEEL.Item.ability.Category.Signature', type: 'system' },
    heroic: { id: 'heroic', name: 'DRAW_STEEL.Item.ability.Category.Heroic', type: 'system' },
    none: { id: 'none', name: 'DRAW_STEEL.Item.ability.Type.None', type: 'system' },
    
    effects: { id: 'effects', name: 'DRAW_STEEL.Actor.Tabs.effects', type: 'system' },
    conditions: { id: 'conditions', name: 'DRAW_STEEL.ActiveEffect.StatusConditions', type: 'system' },
    
    ancestry: { id: 'ancestry', name: 'TYPES.Item.ancestry', type: 'system' },
    background: { id: 'background', name: 'tokenActionHud.draw_steel.Background', type: 'system' },
    heroClass: { id: 'heroClass', name: 'TYPES.Item.class', type: 'system' },
    complication: { id: 'complication', name: 'TYPES.Item.complication', type: 'system'  },
    feature: { id: 'feature', name: 'DRAW_STEEL.Actor.Tabs.features', type: 'system' },
    kit: { id: 'kit', name: 'TYPES.Item.kit', type: 'system' },
    project: { id: 'project', name: 'DRAW_STEEL.Actor.Tabs.projects', type: 'system' },
    treasure: { id: 'treasure', name: 'DRAW_STEEL.Actor.Tabs.features', type: 'system' },
    
    freeStrike: { id: 'free-strike', name: 'DRAW_STEEL.Item.ability.Category.FreeStrike', type: 'system' },
    characteristic: { id: 'characteristic', name: 'DRAW_STEEL.Actor.base.FIELDS.characteristics.label', type: 'system' },
    recoveries: { id: 'recoveries', name: 'DRAW_STEEL.Actor.base.FIELDS.recoveries.label', type: 'system' },
    respite: { id: 'respite', name: 'DRAW_STEEL.ActiveEffect.Ends.Respite.Abbr', type: 'system' },
    heroTokens: { id: 'hero-tokens', name: 'DRAW_STEEL.Setting.HeroTokens.Label', type: 'system' },
    
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
}

/**
 * Item types
 */
export const ITEM_TYPE = {
    ability: { groupId: 'ability' },
    ancestry: { groupId: 'ancestry' },
    ancestryTrait: { groupId: 'ancestry' },
    career: { groupId: 'background' },
    "class": { groupId: 'heroClass' },
    complication: { groupId: 'complication' },
    culture: { groupId: 'background' },
    feature: { groupId: 'feature' },
    kit: { groupId: 'kit' },
    project: { groupId: 'project' },
    treasure: { groupId: 'treasure'}
}

/**
 * Ability types
 */
export const ABILITY_TYPE = {
    main: { groupId: 'main'},
    maneuver: { groupId: 'maneuver'},
    freeManeuver: { groupId: 'free-maneuver'},
    triggered: { groupId: 'triggered'},
    freeTriggered: { groupId: 'free-triggered'},
    signature: { groupId: 'signature'},
    heroic: { groupId: 'heroic'},
    villain: { groupId: 'villain'},
    freeStrike: { groupId: 'free-strike'},
    none: { groupId: 'none'}
}

/**
 * Ability categories
 */
export const ABILITY_CATEGORIES = {
    signature: { groupId: 'signature'},
    heroic: { groupId: 'heroic'},
    villain: { groupId: 'villain'},
    freeStrike: { groupId: 'free-strike'}
    
}

