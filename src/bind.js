import F from './f';

/**
 * Build the arg of this.setState() for current component
 *
 * @param path
 */
const buildChangedRequest = (host) => (path) => (value) => {
	if (path == null || path.trim() === '') {
		return host;
	}

	let result = host;
	let temp = result;
	let stack = path.split('.');

	while (stack.length > 1) {
		let nextProp = stack.shift();
		if (temp[nextProp] == null) {
			temp = temp[nextProp] = {};
		}
		else {
			temp = temp[nextProp];
		}
	}

	temp[stack.shift()] = value;

	return result;
}

/**
 *
 * @param ctx this ref of current component
 */
const doChange = (ctx) => (path) => (value)=> {
	//console.log(buildChangedRequest(ctx.state)(path)(value));
	ctx.setState(buildChangedRequest(ctx.state)(path)(value));
}

/**
 * Usage:
 *
 * <code>
 *      import {oneWayBind} from 'react-redux-data-binding';
 *      let $ = oneWayBind(this.props);
 *      <MyComponent $("username") />
 * </code>
 *
 *
 * @param context
 */
export const oneWayBind = (context) => (path, defaultValue) => {
	return F.of(context).at(path).value(defaultValue);
}

/**
 * Usage :
 * <code>
 *    import {twoWayBind} from 'react-redux-data-binding';
 *    let $$ = twoWayBind(this);
 *    <MyComponent ...$$("username") />
 * </code>
 *
 * @param context
 */
export const twoWayBind = (context) => (path, defaultValue) => {
	return {
		value: F.of(context.state).at(path).value(defaultValue),
		onChange: doChange(context)(path),
	}
}
