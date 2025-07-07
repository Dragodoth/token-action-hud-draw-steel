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
    conditions: 'DRAW_STEEL.Effect.StatusConditions',
    heroTokens: 'DRAW_STEEL.Setting.HeroTokens.Label',
    recoveries: 'DRAW_STEEL.Actor.Character.FIELDS.hero.recoveries.label',
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {
    action: { id: 'action', name: 'DRAW_STEEL.Item.Ability.Type.Action', type: 'system' },
    maneuver: { id: 'maneuver', name: 'DRAW_STEEL.Item.Ability.Type.Maneuver', type: 'system' },
    freeManeuver: { id: 'free-maneuver', name: 'DRAW_STEEL.Item.Ability.Type.FreeManeuver', type: 'system' },
    triggered: { id: 'triggered', name: 'DRAW_STEEL.Item.Ability.Type.Triggered', type: 'system' },
    freeTriggered: { id: 'free-triggered', name: 'DRAW_STEEL.Item.Ability.Type.FreeTriggered', type: 'system' },
    
    signature: { id: 'signature', name: 'DRAW_STEEL.Item.Ability.Category.Signature', type: 'system' },
    heroic: { id: 'heroic', name: 'DRAW_STEEL.Item.Ability.Category.Heroic', type: 'system' },
    other: { id: 'other', name: 'tokenActionHud.others', type: 'system' },
    
    effects: { id: 'effects', name: 'tokenActionHud.draw_steel.Effects', type: 'system' },
    conditions: { id: 'conditions', name: 'DRAW_STEEL.Effect.StatusConditions', type: 'system' },
    
    freeStrike: { id: 'free-strike', name: 'DRAW_STEEL.Item.Ability.Category.FreeStrike', type: 'system' },
    characteristic: { id: 'characteristic', name: 'DRAW_STEEL.Actor.base.FIELDS.characteristics.label', type: 'system' },
    recoveries: { id: 'recoveries', name: 'DRAW_STEEL.Actor.Character.FIELDS.hero.recoveries.label', type: 'system' },
    respite: { id: 'respite', name: 'tokenActionHud.draw_steel.Respite', type: 'system' },
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
    career: { groupId: 'career' },
    complication: { groupId: 'complication' },
    culture: { groupId: 'culture' },
    feature: { groupId: 'feature' },
    equipment: { groupId: 'equipment' },
    kit: { groupId: 'kit' },
    project: { groupId: 'project' }
}

/**
 * Ability types
 */
export const ABILITY_TYPE = {
    action: { groupId: 'action'},
    maneuver: { groupId: 'maneuver'},
    freeManeuver: { groupId: 'free-maneuver'},
    triggered: { groupId: 'triggered'},
    freeTriggered: { groupId: 'free-triggered'},
    signature: { groupId: 'signature'},
    heroic: { groupId: 'heroic'},
    freeStrike: { groupId: 'free-strike'},
    other: { groupId: 'other'}
}

/**
 * Ability categories
 */
export const ABILITY_CATEGORIES = {
    signature: { groupId: 'signature'},
    heroic: { groupId: 'heroic'},
    freeStrike: { groupId: 'free-strike'}
}

