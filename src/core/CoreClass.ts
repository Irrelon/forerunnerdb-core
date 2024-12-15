import {Emitter} from "@irrelon/emitter";
//const _synth: Record<string, (val: any) => any> = {};

export class CoreClass extends Emitter {
	/**
	 * Generates a generic getter/setter method for the passed method name.
	 * @param {string} name The name of the getter/setter to generate.
	 * @returns A getter/setter function for the given property name.
	 */
	// synthesize (name: string) {
	// 	_synth[name] = _synth[name] || function (val: any) {
	// 		if (val !== undefined) {
	// 			this["_" + name] = val;
	// 			return this;
	// 		}
	//
	// 		return this["_" + name];
	// 	};
	//
	// 	return _synth[name];
	// }
}