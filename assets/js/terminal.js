let articles = []
let history = []
let histIndex = -1

async function boot() {
	const term = document.getElementById("terminal")
	print("Loading shitty terminal...")
	await delay(500)
	print("Loading articles...")
	await fetch("articles.json")
	.then(r => r.json())
	.then(data => { articles = data })
	await delay(500)
	motd()
	newPrompt()
}

function motd() {
	print("Welcome to shitty terminal!")
	print("Type 'help' for commands.\n")
	print("Suggested file to open:")
	articles.slice(0, 5).forEach(a => {
		print(`  ${a.title} -> ${a.file}`)
	})
	print("")
}

function newPrompt() {
	const term = document.getElementById("terminal")
	const line = document.createElement("div")
	line.className = "line"

	const prompt = document.createElement("span")
	prompt.className = "prompt"
	prompt.textContent = "z4rathustr4@github.io:~$"

	const input = document.createElement("input")
	input.className = "input"
	input.spellcheck = false
	input.autofocus = true

	line.appendChild(prompt)
	line.appendChild(input)
	term.appendChild(line)
	input.focus()

	input.addEventListener("keydown", e => handleKey(e, input))
}

function handleKey(e, input) {
	if (e.key === "Enter") {
		const cmd = input.value.trim()
		history.push(cmd)
		histIndex = history.length
		runCommand(cmd)
		input.disabled = true
		newPrompt()
	} else if (e.key === "ArrowUp") {
		if (histIndex > 0) {
			histIndex--
			input.value = history[histIndex]
		}
		e.preventDefault()
	} else if (e.key === "ArrowDown") {
		if (histIndex < history.length - 1) {
			histIndex++
			input.value = history[histIndex] || ""
		}
		e.preventDefault()
	} else if (e.key === "Tab") {
		e.preventDefault()
		tabComplete(input)
	}
}

function runCommand(cmd) {
	print(`z4rathustr4@github.io:~$ ${cmd}`)
	const parts = cmd.split(" ")

	if (cmd === "help") {
		print("Commands: help, open <file>, ls, cat <file>, clear")
	} else if (cmd === "ls") {
		print(articles.map(a => a.file).join(" "))
	} else if (parts[0] === "open" && parts[1]) {
		const match = articles.find(a => a.file.includes(parts[1]))
		if (match) {
			window.location.href = match.file
		} else {
			print(`file not found: ${parts[1]}`)
		}
	} else if (parts[0] === "cat" && parts[1]) {
		const match = articles.find(a => a.file.includes(parts[1]))
		if (match) {
			print(`[preview] ${match.title}`)
		} else {
			print(`file not found: ${parts[1]}`)
		}
	} else if (cmd === "clear") {
		document.getElementById("terminal").innerHTML = ""
	} else if (cmd.length > 0) {
		print(`unknown command: ${cmd}`)
	}
}

function tabComplete(input) {
	const val = input.value.trim()
	if (val.startsWith("open ") || val.startsWith("cat ")) {
		const arg = val.split(" ")[1] || ""
		const matches = articles.filter(a => a.file.includes(arg))
		if (matches.length === 1) {
			input.value = val.split(" ")[0] + " " + matches[0].file
		} else if (matches.length > 1) {
			print(matches.map(a => a.file).join(" "))
		}
	}
}

function print(msg) {
	const term = document.getElementById("terminal")
	const p = document.createElement("div")
	p.textContent = msg
	term.insertBefore(p, term.lastChild)
}

function delay(ms) {
	return new Promise(r => setTimeout(r, ms))
}

boot()

