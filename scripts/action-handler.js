// System Module Imports
import { ACTION_TYPE, ITEM_TYPE, ABILITY_TYPE } from './constants.js'
import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} groupIds
         */
        async buildSystemActions (groupIds) {
            // Settings
            this.hideUnavailible = Utils.getSetting('hideUnavailible')
            
            
            // Set actor and token variables
            
            // Set actor variable
            if (this.actor) {
                this.actorType = this.actor?.type
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }
            
            // Check if one or more tokens are selected and distiquish between characters and npcs
            if (this.actor) {
                if (this.actorType === 'hero') {
                    await this.#buildCharacterActions()
                } else if (this.actorType === 'npc') {
                    await this.#buildNpcActions()
                }
            } else {
                if (this.actors.some(actor => actor.type === 'npc')){
                    await this.#buildMultipleNpcTokenActions()
                } else {
                    this.#buildMultipleCharacterTokenActions()
                }
            }
        }
        
        /**
         * Build character actions
         * @private
         */
        async #buildCharacterActions () {
            await this.#buildAbilities()
            this.#buildCharacteristics()
            this.#buildConditions()
            this.#buildEffects()
            await this.#buildFreeStrikes()
            await this.#buildFeatures()
            this.#buildHeroTokens()
            await this.#buildProjects()
            this.#buildRecoveries()
            this.#buildRespite()
        }
        
        /**
         * Build npc actions
         * @private
         */
        async #buildNpcActions () {
            await this.#buildAbilities()
            this.#buildCharacteristics()
            this.#buildConditions()
            this.#buildEffects()
            this.#buildFreeStrikes()
            await this.#buildFeatures()
            this.#buildNPCFreeStrikes()
        }
        
        
        /**
         * Build multiple character token actions
         * @private
         * @returns {object}
         */
        #buildMultipleCharacterTokenActions () {
            this.#buildConditions()
            this.#buildRecoveries()
            this.#buildRespite()
        }
        
        /**
         * Build multiple npc token actions
         * @private
         * @returns {object}
         */
        async #buildMultipleNpcTokenActions () {
            // If all npcs are the same also show abilities
            if (this.actors.every(actor => actor.name === this.actors[0].name)){
                await this.#buildAbilities()
            }
            this.#buildConditions()
        }
        
        /**
         * Build abilities
         * @private
         */
        async #buildAbilities () {
            // Exit if no items exist
            if (this.items.size === 0) return
                
                const actionType = 'item'
                const actionsMap = new Map()
                
                // Get abilities
                for (const [itemId, itemData] of this.items) {
                    if (itemData.type != 'ability' || itemData.system.category === 'freeStrike') continue
                        
                        // Hide unavailable heroic abilities
                        if (this.hideUnavailible && itemData.system.resource > (this.actorType === 'hero' ? this.actor.system.hero.primary.value: this.actor.system.coreResource.target.value)) continue
                            
                            const type = itemData.system.type
                            const typeMap = actionsMap.get(type) ?? new Map()
                            typeMap.set(itemId, itemData)
                            actionsMap.set(type, typeMap)
                            }
            
            
            for (const [type, typeMap] of actionsMap) {
                const groupId = ABILITY_TYPE[type]?.groupId
                
                // Create group data
                if (!groupId) continue
                    const groupData = { id: groupId, type: 'system' }
                
                // Get actions
                const actions = await Promise.all([...typeMap].map(async ([itemId, itemData]) => {
                    const name = itemData.name
                    const info = this.#getAbilityInfo(itemData)
                    
                    let config = {}
                    const content = await itemData.system.toEmbed(config)
                    const tooltip = {
                        content: content.outerHTML
                    }
                    
                    return {
                        id: itemId,
                        name,
                        img: coreModule.api.Utils.getImage(itemData),
                        info1: info?.info1,
                        info2: info?.info2,
                        listName: this.#getListName(actionType, name),
                        tooltip,
                        system: { actionType, actionId: itemId }
                    }
                }))
                
                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
            
        }
        
        /**
         * Build characteristics
         * @private
         */
        #buildCharacteristics () {
            const actionType = 'characteristic'
            
            // Get characteristics
            const characteristics = this.actor.system.characteristics
            
            // Exit if no charactertics exist
            if (characteristics.length === 0) return
                
                // Create group data
                const groupData = { id: 'characteristic', type: 'system' }
            
            // Get actions
            const actions = Object.entries(characteristics).map(([characteristicName, characteristicMod]) => {
                const id = `${characteristicName}`
                return {
                    id,
                    name: this.#getCharacteristicName(characteristicName),
                    info1: { text: coreModule.api.Utils.getModifier(characteristicMod.value) } ?? null,
                    listName: this.#getListName(actionType, id),
                    system: { actionType, actionId: id }
                }
            })
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Build conditions
         * @private
         */
        #buildConditions () {
            if (this.tokens?.length === 0) return
                const actionType = 'conditions'
                
                // Get conditions
                const conditions = CONFIG.statusEffects
                
                // Exit if no conditions exist
                if (conditions.length === 0) return
                    
                    // Create group data
                    const groupData = { id: 'conditions', type: 'system' }
            
            // Get actions
            const actions = conditions.map((condition) => {
                
                const effect = this.actor?.effects.find(effect => effect.statuses?.has(condition.id) && !effect.disabled)
                const active = effect ? ' active' : ''
                const duration = effect?.duration.label ?? ''
                
                const i18nKey = `DRAW_STEEL.Effect.Conditions[${condition.name}]`;
                const name = coreModule.api.Utils.i18n(i18nKey) === i18nKey ? condition.name : coreModule.api.Utils.i18n(i18nKey);
                
                return {
                    id: condition.id,
                    name,
                    info1: { text: duration },
                    img: coreModule.api.Utils.getImage(condition),
                    cssClass: `toggle${active}`,
                    listName: this.#getListName(actionType, condition.id),
                    system: { actionType, actionId: condition.id }
                };
            })
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Build effects
         * @private
         */
        #buildEffects () {
            if (this.tokens?.length === 0) return
                const actionType = 'effects'
                
                // Get effects
                const effects = new Map()
                for (const effect of this.actor.effects) {
                    // exclude status effects
                    if (!effect.statuses.size) effects.set(effect.id, effect)
                        }
            
            // Exit if no effects exist
            if (effects.size === 0) return
                
                // Create group data
                const groupData = { id: 'effects', type: 'system' }
            
            const actions = [...effects].map(([effectId,effectData]) => {
                const active = this.actor.effects.some(effect => effect.id === effectId && !effect?.disabled)
                ? ' active'
                : ''
                return {
                    id: effectId,
                    name: effectData.name,
                    img: coreModule.api.Utils.getImage(effectData),
                    info1: { text: `${effectData.duration.label}`},
                    cssClass: `toggle${active}`,
                    listName: this.#getListName(actionType, effectData.name),
                    system: { actionType, actionId: effectId }
                }
            })
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Build features
         * @private
         */
        async #buildFeatures () {
            if (this.items.size === 0) return
                //if () return
                
                const actionType = 'item'
                const actionsMap = new Map()
                
                // Get features
                for (const [itemId, itemData] of this.items) {
                    if (itemData.type === 'ability') continue
                        
                        const type = itemData.type
                        
                        const typeMap = actionsMap.get(type) ?? new Map()
                        typeMap.set(itemId, itemData)
                        actionsMap.set(type, typeMap)
                        }
            
            for (const [type, typeMap] of actionsMap) {
                const groupId = ITEM_TYPE[type]?.groupId
                
                // Create group data
                if (!groupId) continue
                    const groupData = { id: groupId, type: 'system' }
                
                // Get actions
                const actions = await Promise.all([...typeMap].map(async ([itemId, itemData]) => {
                    const name = itemData.name
                    
                    let config = {}
                    const content = await itemData.system.toEmbed(config)
                    const tooltip = {
                        content: content.outerHTML
                    }
                    
                    return {
                        id: itemId,
                        name,
                        img: coreModule.api.Utils.getImage(itemData),
                        listName: this.#getListName(actionType, name),
                        info1: type === "class" ? { text: coreModule.api.Utils.i18n('DRAW_STEEL.Item.class.FIELDS.level.label')} : null,
                        info2: type === "class" ? { text: `${itemData.system.level}`} : null,
                        tooltip,
                        system: { actionType, actionId: itemId }
                    }
                }))
                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
            
        }
        
        /**
         * Build free strikes
         * @private
         */
        async #buildFreeStrikes () {
            if (this.items.size === 0) return
                
                const actionType = 'item'
                const actionsMap = new Map()
                
                // Get free strikes
                for (const [itemId, itemData] of this.items) {
                    if (itemData.system.category != 'freeStrike') continue
                        actionsMap.set(itemId, itemData)
                        }
            
            // Create group data
            const groupData = { id: 'free-strike', type: 'system' }
            
            // Get actions
            const actions = await Promise.all([...actionsMap].map(async ([itemId, itemData]) => {
                const name = itemData.name
                const info = this.#getAbilityInfo(itemData)
                
                let config = {}
                const content = await itemData.system.toEmbed(config)
                const tooltip = {
                    content: content.outerHTML
                }
                
                return {
                    id: itemId,
                    name,
                    img: coreModule.api.Utils.getImage(itemData),
                    info1: info?.info1,
                    info2: info?.info2,
                    listName: this.#getListName(actionType, name),
                    tooltip,
                    system: { actionType, actionId: itemId }
                }
            }))
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
                
        /**
         * Build hero token actions
         * @private
         */
        #buildHeroTokens () {
            const actionType = 'heroTokens'
            
            
            // Create group data
            const groupData = { id: 'hero-tokens', type: 'system' }
            
            // Get actions
            const actions = [{
                id: 'heroTokensRecovery',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Setting.HeroTokens.RegainStamina.tooltip'),
                img: "icons/svg/regen.svg",
                info1: { text: `${game.actors.heroTokens.value} Hero Tokens` },
                listName: this.#getListName(actionType, 'heroTokensRecovery'),
                system: { actionType, actionId: 'heroTokensRecovery' }
            },
             {
                 id: 'heroTokensSurges',
                 name: coreModule.api.Utils.i18n('DRAW_STEEL.Setting.HeroTokens.GainSurges.label'),
                img: "icons/svg/lightning.svg",
                 info1: { text: `${this.actor.system.hero.surges} Surges` },
                info2: { text: `${game.actors.heroTokens.value} Hero Tokens` },
                 listName: this.#getListName(actionType, 'heroTokensSurges'),
                 system: { actionType, actionId: 'heroTokensSurges' }
             }]
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Build NPC free strikes
         * @private
         */
        #buildNPCFreeStrikes () {
            const actionType = 'npcFreeStrike'
            
            // Create group data
            const groupData = { id: 'free-strike', type: 'system' }
            
            // Get actions
            
            const name = 'Free Strike'
            const actions = [{
                id: 'npcFreeStrike',
                name,
                img: "icons/svg/explosion.svg",
                info1: { text: `${this.actor.system.freeStrike.value}` },
                listName: this.#getListName(actionType, name),
                system: { actionType, actionId: 'npcFreeStrike' }
            }]
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }

        
        /**
         * Build projects
         * @private
         */
        async #buildProjects () {
            if (this.items.size === 0) return
                
                const actionType = 'item'
                const actionsMap = new Map()
                
                // Get free strikes
                for (const [itemId, itemData] of this.items) {
                    if (itemData.type != 'project') continue
                        actionsMap.set(itemId, itemData)
                        }
            
            // Create group data
            const groupData = { id: 'project', type: 'system' }
            
            // Get actions
            const actions = await Promise.all([...actionsMap].map(async ([itemId, itemData]) => {
                const name = itemData.name
                
                let config = {}
                const content = await itemData.system.toEmbed(config)
                const tooltip = {
                    content: content.outerHTML
                }
                
                return {
                    id: itemId,
                    name,
                    img: coreModule.api.Utils.getImage(itemData),
                    info1: { text: `${itemData.system.points} / ${itemData.system.goal}` },
                    listName: this.#getListName(actionType, name),
                    tooltip,
                    system: { actionType, actionId: itemId }
                }
            }))
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Build recoveries
         * @private
         */
        #buildRecoveries () {
            const actionType = 'recoveries'
            
            // Create group data
            const groupData = { id: 'recoveries', type: 'system' }
            
            // Get actions
            const actions = [{
                id: 'recoveries',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Actor.base.SpendRecovery.tooltip'),
                img: "icons/svg/heal.svg",
                info1: { text: `${this.actor.system.recoveries.value} / ${this.actor.system.recoveries.max}` },
                listName: this.#getListName(actionType, 'recoveries'),
                system: { actionType, actionId: 'recoveries' }
            }]
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Build respite
         * @private
         */
        #buildRespite () {
            const actionType = 'respite'
            
            // Create group data
            const groupData = { id: 'respite', type: 'system' }
            
            // Get actions
            const actions = [{
                id: 'respite',
                name: coreModule.api.Utils.i18n('DRAW_STEEL.Actor.hero.TakeRespite'),
                img: "icons/svg/house.svg",
                listName: this.#getListName(actionType, 'respite'),
                system: { actionType, actionId: 'respite' }
            }]
            
            // TAH Core method to add actions to the action list
            this.addActions(actions, groupData)
        }
        
        /**
         * Get ability info
         * @private
         * @param {object} itemData
         * @returns {object}
         */
        #getAbilityInfo (data) {
            const categoryData = this.#getCategoryData(data)
            const resourceData = this.#getResourceData(data)
            
            return {
                info1: { text: categoryData },
                info2: { text: resourceData }
            }
        }
        
        /**
         * Get ability category
         * @private
         * @param {object} itemData
         * @returns {string}
         */
        #getCategoryData (data) {
            if (!data?.system || data.system.category === "") return ''
                const category = data.system.category
                return coreModule.api.Utils.i18n('DRAW_STEEL.Item.ability.Category.' + `${category[0].toUpperCase()}` + `${category.slice(1)}`)
                }
        
        /**
         * Get resource cost
         * @private
         * @param {object} itemData
         * @returns {string}
         */
        #getResourceData (data) {
            if (!data?.system || data.system.category != "heroic") return ''
                return (data.system.resource > 0) ? `${data.system.resource ?? '0'}` : ''
                }
        
        /**
         * Get list name
         * @private
         * @param {string} actionType
         * @param {string} actionName
         * @returns {string}
         */
        #getListName (actionType, actionName) {
            const prefix = `${game.i18n.localize(ACTION_TYPE[actionType])}: ` ?? '';
            return `${prefix}${actionName}` ?? "";
        }
        
        /**
         * Get resource cost
         * @private
         * @param {string} name
         * @returns {string}
         */
        #getCharacteristicName (name) {
            const icons = {
                m: "🅼",
                a: "🅰",
                r: "🆁",
                i: "🅸",
                p: "🅿"
            }
            return icons[name.charAt(0)] + name.substring(1);
        }
    }
    
})
