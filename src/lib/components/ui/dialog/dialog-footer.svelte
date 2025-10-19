<script>
	import { cn } from "$lib/utils.js";
	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="dialog-footer"
	class={cn("flex gap-2 justify-end max-sm:justify-center", className)}
	{...restProps}
>
	{@render children?.()}
</div>