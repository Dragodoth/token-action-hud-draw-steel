import { MODULE } from './constants.js'

/**
 * Register module settings
 * Called by Token Action HUD Core to register Token Action HUD system module settings
 * @param {function} coreUpdate Token Action HUD Core update function
 */
export function register (coreUpdate) {
    game.settings.register(MODULE.ID, 'displayFeatures', {
        name: game.i18n.localize('tokenActionHud.draw_steel.settings.displayFeatures.name'),
        hint: game.i18n.localize('tokenActionHud.draw_steel.settings.displayFeatures.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            coreUpdate(value)
        }
    })
}
