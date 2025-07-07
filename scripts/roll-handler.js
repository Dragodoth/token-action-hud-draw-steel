export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action click
         * Called by Token Action HUD Core when an action is left or right-clicked
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionClick (event, encodedValue) {
            const { actionType, actionId } = this.action.system;
            
            if (!this.actor) {
                for (const token of this.tokens) {
                    const actor = token.actor;
                    await this.handleAction(event, actionType, actor, token, actionId);
                }
            } else {
                await this.handleAction(event, actionType, this.actor, this.token, actionId);
            }
            
        }
        
        /**
         * Handle action hover
         * Called by Token Action HUD Core when an action is hovered on or off
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async handleActionHover (event, encodedValue) {}
        
        /**
         * Handle group click
         * Called by Token Action HUD Core when a group is right-clicked while the HUD is locked
         * @override
         * @param {object} event The event
         * @param {object} group The group
         */
        async handleGroupClick (event, group) {}
        
        /**
         * Handle action
         * @private
         * @param {object} event
         * @param {string} actionType
         * @param {object} actor
         * @param {object} token
         * @param {string} actionId
         */
        async handleAction (event, actionType, actor, token, actionId) {
            console.log(actionType)
            switch (actionType) {
                case 'characteristic':
                    actor.rollCharacteristic(actionId)
                    break
                case 'conditions':
                    actor.toggleStatusEffect(actionId)
                    break
                case 'effects':
                    const effect = actor.effects.find(effect => effect.id === actionId)
                    if (!effect) return
                        
                        if (this.isRightClick && this.isShift) {
                            //await effect.delete()
                        } else {
                            await effect.update({ disabled: !effect.disabled })
                        }
                    Hooks.callAll('forceUpdateTokenActionHud')
                    break
                case 'heroTokens':
                    actor.system.spendStaminaHeroToken()
                    break
                case 'recoveries':
                    actor.system.spendRecovery()
                    break
                case 'respite':
                    actor.system.takeRespite()
                    break
                case 'item':
                    if (this.isRenderItem()) this.renderItem(actor, actionId);
                    const item = actor.items.get(actionId)
                    if (item?.type !== "ability") {
                        console.error("This is not an ability!", item);
                        return;
                    }
                    await item.system.use({ event })
                    break
                case 'utility':
                    //this.#handleUtilityAction(token, actionId)
                    break
            }
        }
        
        /**
         * Handle utility action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleUtilityAction (token, actionId) {
            switch (actionId) {
                case 'endTurn':
                    if (game.combat?.current?.tokenId === token.id) {
                        await game.combat?.nextTurn()
                    }
                    break
            }
        }
    }
})
