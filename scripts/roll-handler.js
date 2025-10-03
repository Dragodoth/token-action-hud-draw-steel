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
                    await this.handleAction(event, actionType, actor, token, actionId)
                }
            } else {
                await this.handleAction(event, actionType, this.actor, this.token, actionId)
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
                            await effect.delete()
                        } else {
                            await effect.update({ disabled: !effect.disabled })
                        }
                    Hooks.callAll('forceUpdateTokenActionHud')
                    break
                case 'heroTokens':
                    if (actionId === 'heroTokensRecovery')
                        await actor.system.spendStaminaHeroToken()
                        if (actionId === 'heroTokensSurges'){
                            /** Code from #gainSurges found in draw-steel/src/module/applications/sheets
                             /hero-sheet.mjs */

                            const heroTokens = game.actors.heroTokens;
                            
                            const spend = await ds.applications.api.DSDialog.confirm({
                                window: {
                                    title: "DRAW_STEEL.Setting.HeroTokens.GainSurges.label",
                                    icon: "fa-solid fa-bolt-lightning",
                                },
                                content: `<p>${game.i18n.format("DRAW_STEEL.Setting.HeroTokens.GainSurges.dialogContent", {
                                value: heroTokens.value,
                              })}</p>`,
                                rejectClose: false,
                            });
                            
                            if (spend) {
                                const valid = await heroTokens.spendToken("gainSurges", { flavor: this.actor.name });
                                if (valid !== false) {
                                    this.actor.update({ "system.hero.surges": this.actor.system.hero.surges + 2 });
                                }
                            }
                        }
                    
                    break
                case 'npcFreeStrike':
                    /** Code from #freeStrike found in draw-steel/src/module/applications/sheets
                     /npc.mjs */
                    
                    try { game.user.targets.map(t => t.actor); } catch (e) {
                        ui.notifications.error("DRAW_STEEL.Actor.npc.FreeStrike.MultiLinked", { localize: true });
                        throw (e);
                    }
                    
                    /** @type {Array<DrawSteelActor>} */
                    const targets = game.user.targets.map(t => t.actor).filter(a => a?.system?.takeDamage).toObject();
                    if (!targets.length) {
                        ui.notifications.error("DRAW_STEEL.Actor.npc.FreeStrike.NoTargets", { localize: true });
                        return;
                    }
                    const freeStrike = this.actor.system.freeStrike;
                    
                    const damageLabel = game.i18n.format("DRAW_STEEL.Actor.npc.FreeStrike.DialogHeader", {
                        value: freeStrike.value,
                        type: ds.CONFIG.damageTypes[freeStrike.type]?.label ?? "",
                    });
                    const keywordFormatter = game.i18n.getListFormatter({ type: "unit" });
                    const keywordList = freeStrike.keywords.toObject().map(k => ds.CONFIG.abilities.keywords[k]?.label);
                    
                    let content = `<span>${keywordFormatter.format([damageLabel, ...keywordList])}</span>`;
                    
                    content += targets.map(a => {
                        const checkboxInput = foundry.applications.fields.createCheckboxInput({ name: a.uuid, value: true });
                        const formGroup = foundry.applications.fields.createFormGroup({
                            label: a.name,
                            input: checkboxInput,
                            classes: ["inline"],
                        });
                        // style fix
                        const label = formGroup.querySelector("label");
                        label.classList.add("checkbox");
                        label.style = "font-size: inherit;";
                        return formGroup.outerHTML;
                    }).join("");
                    
                    /** @type {object} */
                    const fd = await ds.applications.api.DSDialog.input({
                        window: { title: "DRAW_STEEL.Actor.npc.FreeStrike.DialogTitle", icon: "fa-solid fa-burst" },
                        content,
                        ok: {
                            label: "DRAW_STEEL.Actor.npc.FreeStrike.DialogButton",
                        },
                    });
                    
                    if (fd) {
                        for (const [uuid, bool] of Object.entries(fd)) {
                            if (bool) {
                                /** @type {DrawSteelActor} */
                                const actor = fromUuidSync(uuid);
                                actor.system.takeDamage(freeStrike.value, { type: freeStrike.type });
                            }
                        }
                    }
                    break
                case 'recoveries':
                    await actor.system.spendRecovery()
                    break
                case 'respite':
                    await actor.system.takeRespite()
                    break
                case 'item':
                    if (this.isRenderItem()) {
                        this.renderItem(actor, actionId);
                        break
                    }
                    const item = actor.items.get(actionId)
                    if (item?.type === "ability" ) {
                        await item.system.use({ event })
                        return
                    } else if (item?.type === "project") {
                        if (this.isShift) {
                            await item.system.spendCareerPoints()
                        } else {
                            await item.system.roll({ event })
                        }
                        return
                    }
                    
                    console.error("This is not an ability!", item);
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
