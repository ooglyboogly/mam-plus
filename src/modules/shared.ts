/// <reference path="../check.ts" />

/**
 * SHARED CODE
 *
 * This is for anything that's shared between files, but is not generic enough to
 * to belong in `Utils.ts`. I can't think of a better way to categorize DRY code.
 */

class Shared {
    /**
     * Receive a target and `this._settings.title`
     * @param tar CSS selector for a text input box
     */
    // TODO: with all Checking being done in `Util.startFeature()` it's no longer necessary to Check in this function
    public fillGiftBox = (
        tar: string,
        settingTitle: string
    ): Promise<number | undefined> => {
        if (MP.DEBUG) console.log(`Shared.fillGiftBox( ${tar}, ${settingTitle} )`);

        return new Promise((resolve) => {
            Check.elemLoad(tar).then(() => {
                const pointBox: HTMLInputElement = <HTMLInputElement>(
                    document.querySelector(tar)
                );
                if (pointBox) {
                    const userSetPoints: number = parseInt(
                        GM_getValue(`${settingTitle}_val`)
                    );
                    let maxPoints: number = parseInt(pointBox.getAttribute('max')!);
                    if (!isNaN(userSetPoints) && userSetPoints <= maxPoints) {
                        maxPoints = userSetPoints;
                    }
                    pointBox.value = maxPoints.toFixed(0);
                    resolve(maxPoints);
                } else {
                    resolve(undefined);
                }
            });
        });
    };

    /**
     * Returns list of all results from Browse page
     */
    public getSearchList = (): Promise<NodeListOf<HTMLTableRowElement>> => {
        if (MP.DEBUG) console.log(`Shared.getSearchList( )`);
        return new Promise((resolve, reject) => {
            // Wait for the search results to exist
            Check.elemLoad('#ssr tr[id ^= "tdr"] td').then(() => {
                // Select all search results
                const snatchList: NodeListOf<HTMLTableRowElement> = <
                    NodeListOf<HTMLTableRowElement>
                >document.querySelectorAll('#ssr tr[id ^= "tdr"]');
                if (snatchList === null || snatchList === undefined) {
                    reject(`snatchList is ${snatchList}`);
                } else {
                    resolve(snatchList);
                }
            });
        });
    };
}
