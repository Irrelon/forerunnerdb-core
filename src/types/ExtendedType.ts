/**
 * @typedef ExtendedType {Object}
 * @property {Boolean} isFlat Is true if the type is non-recursive. Instances
 * such as Date or RegExp are considered flat as they do not contain sub-object
 * data that is usefully recursive.
 * @property {TypeString} type The name of the type
 * @property {String} [instance] If the type is an object, this will be the name
 * of the constructor as reported by obj.constructor.name.
 */
export interface ExtendedType {
	isFlat: boolean;
	instance: string;
	type: string;
}