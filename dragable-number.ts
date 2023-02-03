interface ClampedValue {
	value: number;
	state: "minClamped" | "maxClamped" | "inRange";
}
class DragableNumber extends HTMLElement {
	static get observedAttributes(): Array<string> {
		return ["min", "max", "step", "threshold"];
	}
	get min(): number {
		if (this.hasAttribute("min"))
			return Number(this.getAttribute("min"));
		else
			return 0;
	}
	get max(): number {
		if (this.hasAttribute("max"))
			return Number(this.getAttribute("max"));
		else
			return 100;
	}
	get step(): number {
		if (this.hasAttribute("step"))
			return Number(this.getAttribute("step"));
		else
			return 1;
	}
	get threshold(): number {
		if (this.hasAttribute("threshold"))
			return Number(this.getAttribute("threshold"));
		else
			return 1;
	}
	get value(): number {
		return Number(this.innerText);
	}
	
	constructor() {
		super();

	}
	connectedCallback(): void {
		const value = this.hasAttribute("initial") ?
			Number(this.getAttribute("initial")) : this.min;
		if (isNaN(value))
			throw new Error("dragable-number: Does not contain a number.")
		else if (value < this.min || value > this.max)
			throw new Error("dragable-number: Initial value outside allowable range.")
		this.innerText = value.toString();
		const state = value === this.min ?
			"minClamped" : value === this.max ?
			"maxClamped" : "inRange";
		this.setAttribute("state", state);
		this.addEventListener("mousedown", this.downHandler);
		this.style.userSelect = "none";
	}
	private attributeChangedCallback(attr: string,
									 previous: string,
									 current: string) {
	}
	private boundDownHandler = this.downHandler.bind(this);
	private boundUpHandler = this.upHandler.bind(this);
	private boundMoveHandler = this.moveHandler.bind(this);
	private lastX = 0;
	private lastY = 0;
	private downHandler(event) {
		this.lastX = event.clientX;
		this.lastY = event.clientY;
		this.removeEventListener("mousedown", this.downHandler);
		document.addEventListener("mouseup", this.boundUpHandler);
		document.addEventListener("mousemove", this.boundMoveHandler);
	}
	private clamp(value: number): ClampedValue {
		if (value <= this.min)
			return {value: this.min, state: "minClamped"};
		else if (value >= this.max)
			return {value: this.max, state: "maxClamped"};
		else
			return {value: value, state: "inRange"};
	}
	private moveHandler(event) {
		let distance = -(event.clientY - this.lastY);
		if (Math.abs(distance) > this.threshold) {
			const steps = distance/this.threshold;
			// NOTE: subtract just in case an event is skipped.
			this.lastY = event.clientY -
				this.threshold*(steps - Math.trunc(steps));
			const oldValue = Number(this.innerText);
			const clampedValue = this.clamp(
				 oldValue + Math.trunc(steps)*this.step);
			this.innerText = String(clampedValue.value);
			this.setAttribute("state", clampedValue.state);
			if (oldValue != clampedValue.value)
				this.dispatchEvent(new CustomEvent("changed"));
		}
	}
	private upHandler(event) {
		document.removeEventListener("mousemove", this.boundMoveHandler);
		document.removeEventListener("mouseup", this.boundUpHandler);
		this.addEventListener("mousedown", this.boundDownHandler);
	}
}
customElements.define("dragable-number", DragableNumber);
