console.log("marked:", typeof marked); // debería mostrar "function"

const lista = document.getElementById("recetas-lista");
const contenido = document.getElementById("receta-contenido");

// Carga la lista de recetas desde un JSON
fetch("recetas/index.json")
	.then((res) => res.json())
	.then((recetas) => {
		recetas.forEach((nombre) => {
			const btn = document.createElement("button");
			btn.textContent = formatearNombre(nombre);
			btn.onclick = () => cargarReceta(`recetas/${nombre}.md`);
			lista.appendChild(btn);
		});
	})
	.catch((err) => {
		lista.textContent = "Error al cargar la lista de recetas.";
		console.error("Error al leer index.json:", err);
	});

// Función para mostrar una receta al hacer clic
function cargarReceta(url) {
	fetch(url)
		.then((res) => res.text())
		.then((md) => {
			contenido.classList.remove("visible"); // Oculta
			setTimeout(() => {
				const html = markdownToHTML(md);
				contenido.innerHTML = html;
				contenido.classList.add("visible"); // Muestra con fade
			}, 100); // Delay breve para reiniciar animación
		})
		.catch((err) => {
			contenido.innerHTML = "<p>Error al cargar la receta.</p>";
			console.error("Error al cargar la receta:", err);
		});
}

// Conversor simple de Markdown a HTML
function markdownToHTML(md) {
	return marked.marked(md);
}

// Formatear el nombre del archivo a un nombre legible
function formatearNombre(nombre) {
	return nombre
		.replace(".md", "")
		.replace(/-/g, " ")
		.replace(/_/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Cambiar tema manual
const themeToggleBtn = document.getElementById("theme-toggle");
const userTheme = localStorage.getItem("theme");

function applyTheme(theme) {
	document.documentElement.setAttribute("data-theme", theme);
	themeToggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

// Aplicar preferencia guardada o del sistema
if (userTheme) {
	applyTheme(userTheme);
} else {
	const prefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)"
	).matches;
	applyTheme(prefersDark ? "dark" : "light");
}

// Cambiar tema al hacer clic
themeToggleBtn.addEventListener("click", () => {
	const current = document.documentElement.getAttribute("data-theme");
	const newTheme = current === "dark" ? "light" : "dark";
	localStorage.setItem("theme", newTheme);
	applyTheme(newTheme);
});

const scrollTopBtn = document.getElementById("scroll-top-btn");
const recetaContenido = document.getElementById("receta-contenido");

recetaContenido.addEventListener("scroll", () => {
	if (recetaContenido.scrollTop > 200) {
		scrollTopBtn.style.display = "block";
	} else {
		scrollTopBtn.style.display = "none";
	}
});

scrollTopBtn.addEventListener("click", () => {
	recetaContenido.scrollTo({
		top: 0,
		behavior: "smooth",
	});
});
