<script>
	let question = "Can you tell me a joke?";
	function submitQuestion() {
		user.loggedIn = !user.loggedIn;
	}
</script>

<main>
	<img src="/img/logo_animated.svg" alt="Logo Ask a Stranger" />
	<h1>Ask a Stranger</h1>
	<textarea bind:value={question} />
	<div>
		<button
			class="button-5"
			disabled={question === ""}
			on:click={submitQuestion}
			type="submit">Ask Question</button
		>
	</div>
</main>

<style lang="scss">
	textarea {
		width: 380px;
		max-width: 100%;
		margin-top: 20px;
		height: 80px;
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #fa6400;
		font-size: 4em;
		font-weight: 100;
		margin: 0;
	}

	/* CSS */
	.button-5 {
		align-items: center;
		background-clip: padding-box;
		background-color: #fa6400;
		border: 1px solid transparent;
		border-radius: 0.25rem;
		box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
		box-sizing: border-box;
		color: #fff;
		cursor: pointer;
		font-size: 16px;
		font-weight: 600;
		justify-content: center;
		line-height: 1.25;
		margin: 0;
		min-height: 3rem;
		padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
		position: relative;
		text-decoration: none;
		transition: all 250ms;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		vertical-align: baseline;
		width: auto;
		&:hover {
			transform: translateY(-1px);
			background-color: #fb8332;
			box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
		}
		&:active {
			background-color: #c85000;
			box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
			transform: translateY(0);
		}
		&:disabled {
			background-color: grey;
			transform: translateY(0px);
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
