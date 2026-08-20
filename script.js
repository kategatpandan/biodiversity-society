// Check if browser supports Web Speech API
const speechSynthesis = window.speechSynthesis;
const isSpeechSupported = speechSynthesis && speechSynthesis.getVoices;

// AI Explanation Feature
const aiExplanationBtn = document.getElementById('aiExplanationBtn');
const aiExplanationModal = document.getElementById('aiExplanationModal');
const closeAiModal = document.getElementById('closeAiModal');
const sectionSelect = document.getElementById('sectionSelect');
const playVoiceBtn = document.getElementById('playVoiceBtn');
const pauseVoiceBtn = document.getElementById('pauseVoiceBtn');
const stopVoiceBtn = document.getElementById('stopVoiceBtn');
const aiVoiceText = document.getElementById('aiVoiceText');
const voiceStatus = document.getElementById('voiceStatus');
const aiVoiceContainer = document.getElementById('aiVoiceContainer');

// Calculator Info Modal
const calculatorInfoModal = document.getElementById('calculatorInfoModal');
const calculatorInfoBtn = document.getElementById('calculatorInfoBtn');
const closeCalculatorInfo = document.getElementById('closeCalculatorInfo');

// Save Results Modal
const saveResultsModal = document.getElementById('saveResultsModal');
const closeSaveModal = document.getElementById('closeSaveModal');
const saveResultsBtn = document.getElementById('saveResults');
const saveableResults = document.getElementById('saveableResults');
const saveResultsBtnInQuiz = document.getElementById('saveResultsBtn');

// Video Modal
const videoModal = document.getElementById('videoModal');
const closeVideoModal = document.getElementById('closeVideoModal');
const videoFrame = document.getElementById('videoFrame');
const videoModalTitle = document.getElementById('videoModalTitle');

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

// Mobile Navigation
const mobileMenu = document.getElementById('mobileMenu');
const navMenu = document.getElementById('navMenu');

// Web Speech API
let currentUtterance = null;
let isPlaying = false;

// Mobile Menu Toggle
mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Open AI Explanation Modal
aiExplanationBtn.addEventListener('click', () => {
    aiExplanationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close AI Explanation Modal
closeAiModal.addEventListener('click', () => {
    aiExplanationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    stopSpeech();
});

// Close modal when clicking outside
aiExplanationModal.addEventListener('click', (e) => {
    if (e.target === aiExplanationModal) {
        aiExplanationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        stopSpeech();
    }
});

// Open Calculator Info Modal
calculatorInfoBtn.addEventListener('click', () => {
    calculatorInfoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close Calculator Info Modal
closeCalculatorInfo.addEventListener('click', () => {
    calculatorInfoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
calculatorInfoModal.addEventListener('click', (e) => {
    if (e.target === calculatorInfoModal) {
        calculatorInfoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Open Save Results Modal
function openSaveResultsModal() {
    saveResultsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Save Results Modal
closeSaveModal.addEventListener('click', () => {
    saveResultsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
saveResultsModal.addEventListener('click', (e) => {
    if (e.target === saveResultsModal) {
        saveResultsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Save Results Function
saveResultsBtn.addEventListener('click', () => {
    const saveableElement = document.getElementById('saveableResults');
    if (typeof html2canvas !== 'undefined') {
        html2canvas(saveableElement).then(canvas => {
            const imageData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'biodiversity-quiz-results.png';
            link.href = imageData;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } else {
        alert('Save functionality requires the html2canvas library. Please include it in your project.');
    }
});

// Video Modal Functionality
document.querySelectorAll('.video-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const videoId = btn.getAttribute('data-video-id');
        const videoCard = btn.closest('.video-card');
        const videoTitle = videoCard.querySelector('h3').textContent;
        
        videoModalTitle.textContent = videoTitle;
        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close Video Modal
closeVideoModal.addEventListener('click', () => {
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    videoFrame.src = '';
});

// Close modal when clicking outside
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        videoFrame.src = '';
    }
});

// Update voice explanation when section changes
sectionSelect.addEventListener('change', () => {
    updateVoiceExplanation();
    stopSpeech();
});

// Voice explanation content
const voiceExplanations = {
    'home': `
        <p>Welcome to our website on Biodiversity Threats and Healthy Society. This platform explores the critical connections between biodiversity loss and human health, and how science and technology can help address these challenges.</p>
        <p>Biodiversity loss represents one of the most critical challenges of our time, with profound implications for human health, economic stability, and social well-being. Through this website, we examine how the decline in species and ecosystems affects our health, food security, and quality of life.</p>
        <p>We also explore the role of science in understanding these threats, technology in monitoring and mitigating them, and society in shaping policies and behaviors that can protect our natural world.</p>
    `,
    'key-facts': `
        <p>Let me share some key facts about biodiversity that highlight its importance for human health and society.</p>
        <p>Did you know that over 75% of global food crops rely on pollinators? These tiny creatures contribute between 235 and 577 billion US dollars annually to global agricultural output.</p>
        <p>In medicine, over 50% of modern medicines are derived from natural sources, including antibiotics from fungi and painkillers from plant compounds.</p>
        <p>Forests, which store 80% of terrestrial biodiversity, absorb approximately 2.6 billion tonnes of carbon dioxide annually, playing a crucial role in climate regulation.</p>
        <p>Invasive alien species contribute to 60% of species extinctions and cause 423 billion US dollars in global economic damage each year.</p>
        <p>Healthy ecosystems provide 75% of global freshwater resources, yet since 1970, we've lost 35% of our wetlands.</p>
        <p>Finally, Indigenous Peoples manage over 38 million square kilometers of land globally, including nearly 40% of all protected areas, demonstrating their crucial role as environmental stewards.</p>
    `,
    'overview': `
        <p>Biodiversity refers to the variety of life on Earth at all levels, from genes to ecosystems. It encompasses the evolutionary, ecological, and cultural processes that sustain life.</p>
        <p>Biodiversity includes three main levels: genetic diversity, which is the variation of genes within a species; species diversity, which is the variety of species within a habitat or region; and ecosystem diversity, which refers to the variety of ecosystems in a given place.</p>
        <p>Healthy communities depend on well-functioning ecosystems that provide essential services like clean air, fresh water, medicines, and food security. These ecosystems also help regulate diseases and stabilize our climate.</p>
        <p>Unfortunately, biodiversity loss is accelerating at an unprecedented rate, with approximately 1 million species at risk of extinction. This threatens the vital services that ecosystems provide and increases public health risks globally.</p>
    `,
    'threats': `
        <p>Biodiversity faces numerous threats, primarily driven by human activities. Let me explain the major challenges.</p>
        <p>Habitat destruction is a primary threat, with one-third of the planet's land now degraded. Forests, wetlands, and other critical ecosystems are being cleared at alarming rates, making it harder to feed our growing global population.</p>
        <p>Unsustainable practices like oil drilling, fracking, mining, and factory farming are destroying ecosystems while displacing, contaminating, and killing countless species.</p>
        <p>Overexploitation through overfishing, illegal wildlife trade, and unsustainable harvesting is pushing many species to the brink of extinction.</p>
        <p>Climate change, with rising temperatures, ocean acidification, and extreme weather events, is disrupting ecosystems and threatening species that cannot adapt quickly enough.</p>
        <p>Zoonotic spillover occurs when habitat destruction brings humans and wildlife into closer contact, dramatically increasing our risk of exposure to pathogens that jump from animals to humans.</p>
        <p>Pollution from plastics, chemicals, and air contaminants is poisoning our land, water, and air, harming both wildlife and human health.</p>
        <p>According to UN Secretary-General António Guterres, "Humanity has become a weapon of mass extinction. And ultimately, we are committing suicide by proxy."</p>
    `,
    'impact': `
        <p>The loss of biodiversity has profound impacts on human health, economies, and societies.</p>
        <p>Human health relies directly on ecosystem resources, products, and services. When biodiversity declines, we lose potential sources of new medicines, and ecosystem services may no longer meet societal needs, leading to significant health impacts.</p>
        <p>The economic consequences are staggering. The global economic impact of biodiversity loss amounts to 10 trillion US dollars annually. This includes healthcare costs from increased disease transmission and agricultural losses from reduced pollination and soil fertility.</p>
        <p>Socially, changes in ecosystems can affect livelihoods, income, and may even cause or increase political conflict as resources become scarce. Communities that depend directly on natural resources for their survival are particularly vulnerable.</p>
    `,
    'health': `
        <p>Biodiversity loss contributes to several major global health issues.</p>
        <p>Long COVID often disrupts a person's ability to engage with school, work, or relationships for months at a time. People with long COVID need diagnostic and proper rehabilitation support.</p>
        <p>Cardiovascular diseases are the leading causes of death globally, accounting for 28% of total deaths in 2021. Most can be prevented by addressing modifiable risk factors such as high blood pressure, obesity, and air pollution - all of which are influenced by environmental factors.</p>
        <p>Lower respiratory infections, such as pneumonia and bronchitis, affect the lungs and breathing passages. Air pollution and environmental degradation can exacerbate these conditions.</p>
        <p>HIV/AIDS has become one of the world's most serious health challenges since the first cases were reported in 1981. Approximately 86 million people have become infected with HIV since the start of the epidemic.</p>
        <p>Over 75% of emerging infectious diseases are zoonotic and often arise in areas where ecosystems have been disrupted by deforestation or land-use change.</p>
        <p>The destruction of ecosystems accelerates climate change, leading to increased heatwaves, floods, and other climate-related health risks, including heat-stress and malnutrition.</p>
    `,
    'technology': `
        <p>Technology is revolutionizing healthcare and biodiversity conservation in remarkable ways.</p>
        <p>Wearable health technology provides continuous monitoring, early detection, and personalized treatment, helping reduce healthcare costs while improving outcomes. These devices can track vital signs, physical activity, and even environmental exposures.</p>
        <p>Telemedicine enables virtual communication between patients and physicians, eliminating the need for patients to travel to clinics while maintaining quality care. This is particularly valuable in remote areas with limited healthcare access.</p>
        <p>Robotic surgical systems help doctors perform complex operations with more accuracy, flexibility, and control than traditional methods. These systems can reduce recovery times and improve surgical outcomes.</p>
        <p>mRNA technology holds promise for treating various diseases, including cancer and genetic disorders, building on its success with COVID-19 vaccines. This technology represents a breakthrough in how we approach disease prevention and treatment.</p>
        <p>In biodiversity conservation, technology like satellite monitoring, DNA barcoding, and AI-powered camera traps are helping scientists track species populations, monitor ecosystem health, and combat illegal wildlife trade.</p>
    `,
    'sts': `
        <p>The STS connection refers to the intersection of Science, Technology, and Society in addressing biodiversity threats.</p>
        <p>Science provides the evidence base for understanding biodiversity threats and their impacts. Through research and data collection, scientists help us comprehend the complex relationships between ecosystems, species, and human well-being.</p>
        <p>Technology offers tools for monitoring, mitigation, and conservation solutions. From satellite imagery to genetic sequencing, technological advancements provide new ways to study and protect biodiversity.</p>
        <p>Society determines the values, policies, and behaviors that shape our relationship with nature. Cultural norms, economic systems, and political decisions all influence how we interact with and protect our natural world.</p>
        <p>The relationship between biodiversity and human society is complex and bidirectional. While human activities drive biodiversity loss, the resulting ecological degradation threatens human health, food security, and social stability.</p>
        <p>An integrated approach that considers scientific evidence, technological possibilities, and societal values is essential for effective biodiversity conservation and creating a sustainable future.</p>
    `,
    'videos': `
        <p>Our video resources section provides engaging visual content to help you understand biodiversity concepts more deeply.</p>
        <p>We have curated several educational videos that cover different aspects of biodiversity, including why it's important, what it is, how human activities impact it, and the ecosystem services it provides.</p>
        <p>These videos are excellent resources for visual learners and those who prefer multimedia content over text. They can help reinforce the concepts discussed throughout this website and provide additional perspectives on biodiversity issues.</p>
        <p>Each video is accompanied by a brief description to help you choose which ones to watch based on your interests and learning needs.</p>
    `
};

// Update voice explanation based on selected section
function updateVoiceExplanation() {
    const selectedSection = sectionSelect.value;
    aiVoiceText.innerHTML = voiceExplanations[selectedSection] || '<p>Explanation not available for this section.</p>';
}

// Initialize voice explanation
updateVoiceExplanation();

// Voice explanation controls
playVoiceBtn.addEventListener('click', () => {
    if (!isPlaying) {
        playSpeech();
    }
});

pauseVoiceBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSpeech();
    }
});

stopVoiceBtn.addEventListener('click', () => {
    stopSpeech();
});

// Speech functions
function playSpeech() {
    if (!isSpeechSupported) {
        showSpeechNotSupportedWarning();
        return;
    }
    
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        return;
    }
    
    const selectedSection = sectionSelect.value;
    const text = voiceExplanations[selectedSection] || 'No explanation available for this section.';
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    if (speechSynthesis.speaking && speechSynthesis.paused) {
        speechSynthesis.resume();
    } else {
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Samantha'))
        );
        if (preferredVoice) {
            currentUtterance.voice = preferredVoice;
        }
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        currentUtterance.onstart = () => {
            isPlaying = true;
            playVoiceBtn.disabled = true;
            pauseVoiceBtn.disabled = false;
            stopVoiceBtn.disabled = false;
            voiceStatus.style.display = 'flex';
            aiVoiceText.classList.add('voice-playing');
        };
        
        currentUtterance.onend = () => {
            isPlaying = false;
            playVoiceBtn.disabled = false;
            pauseVoiceBtn.disabled = true;
            stopVoiceBtn.disabled = true;
            voiceStatus.style.display = 'none';
            aiVoiceText.classList.remove('voice-playing');
        };
        
        currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            isPlaying = false;
            playVoiceBtn.disabled = false;
            pauseVoiceBtn.disabled = true;
            stopVoiceBtn.disabled = true;
            voiceStatus.style.display = 'none';
            aiVoiceText.classList.remove('voice-playing');
            
            if (event.error === 'not-allowed') {
                alert('Voice explanation is not allowed in this browser. Please check your browser permissions.');
            } else {
                alert('Sorry, there was an error with the voice explanation. Please try again or use the video explanation instead.');
            }
        };
        
        speechSynthesis.speak(currentUtterance);
    }
}

function pauseSpeech() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPlaying = false;
        playVoiceBtn.disabled = false;
        pauseVoiceBtn.disabled = true;
        voiceStatus.style.display = 'none';
        aiVoiceText.classList.remove('voice-playing');
    }
}

function stopSpeech() {
    speechSynthesis.cancel();
    isPlaying = false;
    playVoiceBtn.disabled = false;
    pauseVoiceBtn.disabled = true;
    stopVoiceBtn.disabled = true;
    voiceStatus.style.display = 'none';
    aiVoiceText.classList.remove('voice-playing');
}

function showSpeechNotSupportedWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        background-color: #ffebee;
        border: 1px solid #e74c3c;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #c62828;
        font-weight: 500;
    `;
    warningDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
        Voice explanation is not supported in your browser. Please try using Chrome, Edge, or Safari for this feature.
    `;
    aiVoiceContainer.insertBefore(warningDiv, aiVoiceContainer.firstChild);
    playVoiceBtn.disabled = true;
    pauseVoiceBtn.disabled = true;
    stopVoiceBtn.disabled = true;
}

// Initialize voices when they are loaded
if (isSpeechSupported) {
    speechSynthesis.onvoiceschanged = function() {
        // Voices are loaded, we can use them now
    };
}

// Back to Top Button Functionality
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Search Functionality
const searchToggle = document.querySelector('.search-toggle');
const searchBar = document.querySelector('.search-bar');
const searchInput = document.querySelector('.search-input');

searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        searchInput.focus();
    }
});

document.addEventListener('click', (e) => {
    if (!searchToggle.contains(e.target) && !searchBar.contains(e.target)) {
        searchBar.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchBar.classList.remove('active');
        searchInput.value = '';
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
    }
});

// Sample search data
const searchData = [
    { title: "Food Security", content: "Over 75% of global food crops rely on pollinators, contributing US$ 235–577 billion annually to global agricultural output.", section: "key-facts" },
    { title: "Medicine", content: "Over 50% of modern medicines are derived from natural sources, including antibiotics from fungi and painkillers from plant compounds.", section: "key-facts" },
    { title: "Climate Regulation", content: "Forests store 80% of terrestrial biodiversity, absorbing approximately 2.6 billion tonnes of carbon dioxide annually.", section: "key-facts" },
    { title: "Invasive Species", content: "Invasive alien species contribute to 60% of species extinctions, causing US$ 423 billion in global economic damage each year.", section: "key-facts" },
    { title: "Freshwater Resources", content: "Healthy ecosystems provide 75% of global freshwater resources. Since 1970, 35% of wetlands have been lost.", section: "key-facts" },
    { title: "Indigenous Stewardship", content: "Indigenous Peoples manage over 38 million km² of land globally, including nearly 40% of all protected areas.", section: "key-facts" },
    { title: "Habitat Destruction", content: "One-third of the planet's land is now degraded, making it harder to feed our growing global population.", section: "threats" },
    { title: "Zoonotic Spillover", content: "Habitat destruction brings humans and wildlife into closer contact, dramatically increasing our risk of exposure to pathogens.", section: "threats" },
    { title: "Health Impacts", content: "Human health relies on ecosystem resources, products and services.", section: "impact" },
    { title: "Long COVID", content: "The health impact of long COVID often disrupts a person's ability to engage with school, work, or relationships.", section: "health" },
    { title: "Wearable Health Technology", content: "Wearables provide continuous monitoring, early detection, and personalized treatment.", section: "technology" },
    { title: "Telemedicine", content: "Telemedicine enables virtual communication between patients and physicians.", section: "technology" },
    { title: "STS Connection", content: "The relationship between biodiversity and human society is complex and bidirectional.", section: "sts" }
];

function performSearch(query) {
    if (!query.trim()) return;
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
    );
    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    const existingResults = document.querySelector('.search-results');
    if (existingResults) existingResults.remove();
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-results';
        noResults.innerHTML = `
            <div class="search-results-content">
                <h3>No results found for "${query}"</h3>
                <p>Try searching with different keywords.</p>
                <button class="close-results">Close</button>
            </div>
        `;
        document.body.appendChild(noResults);
        noResults.querySelector('.close-results').addEventListener('click', () => noResults.remove());
        noResults.addEventListener('click', (e) => { if (e.target === noResults) noResults.remove(); });
        return;
    }
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    resultsContainer.innerHTML = `
        <div class="search-results-content">
            <h3>Search Results for "${query}"</h3>
            <div class="results-list">
                ${results.map(result => `
                    <div class="result-item" data-section="${result.section}">
                        <h4>${result.title}</h4>
                        <p>${result.content.substring(0, 100)}...</p>
                        <span class="result-section">${result.section.replace('-', ' ').toUpperCase()}</span>
                    </div>
                `).join('')}
            </div>
            <button class="close-results">Close</button>
        </div>
    `;
    document.body.appendChild(resultsContainer);
    
    resultsContainer.querySelectorAll('.result-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            const targetElement = document.getElementById(section);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
                resultsContainer.remove();
                searchInput.value = '';
                searchBar.classList.remove('active');
            }
        });
    });
    
    resultsContainer.querySelector('.close-results').addEventListener('click', () => resultsContainer.remove());
    resultsContainer.addEventListener('click', (e) => { if (e.target === resultsContainer) resultsContainer.remove(); });
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) performSearch(query);
    }
});

// Timeline Expand/Collapse Functionality
const expandBtn = document.querySelector('.expand-timeline-btn');
const collapseBtn = document.querySelector('.collapse-timeline-btn');
const fullTimeline = document.getElementById('fullTimeline');

if (expandBtn && collapseBtn && fullTimeline) {
    expandBtn.addEventListener('click', () => {
        fullTimeline.classList.add('active');
        fullTimeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    collapseBtn.addEventListener('click', () => {
        fullTimeline.classList.remove('active');
        document.querySelector('.timeline-overview').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Interactive Stats Counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (stat.getAttribute('data-target') === '75' ? '%' : '%');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + (stat.getAttribute('data-target') === '75' ? '%' : '%');
            }
        }, 20);
    });
}

const statsSection = document.querySelector('.stats-counter');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});
if (statsSection) observer.observe(statsSection);

// Interactive Ecosystem Visualization
const ecosystemCanvas = document.getElementById('ecosystemCanvas');
const ctx = ecosystemCanvas.getContext('2d');

function setCanvasDimensions() {
    ecosystemCanvas.width = ecosystemCanvas.parentElement.offsetWidth;
    ecosystemCanvas.height = ecosystemCanvas.parentElement.offsetHeight;
}
setCanvasDimensions();
window.addEventListener('resize', setCanvasDimensions);

let species = [];
let threats = [];
let ecosystemHealth = 100;

class Species {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = type === 'plant' ? 5 : type === 'herbivore' ? 8 : 10;
        this.speed = type === 'plant' ? 0 : type === 'herbivore' ? 1 : 1.5;
        this.direction = Math.random() * Math.PI * 2;
        this.energy = 100;
        this.color = this.getColor();
    }
    getColor() {
        switch(this.type) {
            case 'plant': return '#1a5d1a';
            case 'herbivore': return '#ff6b35';
            case 'carnivore': return '#e74c3c';
            default: return '#000000';
        }
    }
    update() {
        if (this.type === 'plant') return;
        if (Math.random() < 0.02) this.direction = Math.random() * Math.PI * 2;
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        if (this.x < this.size || this.x > ecosystemCanvas.width - this.size) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y < this.size || this.y > ecosystemCanvas.height - this.size) {
            this.direction = -this.direction;
        }
        this.x = Math.max(this.size, Math.min(ecosystemCanvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(ecosystemCanvas.height - this.size, this.y));
        this.energy -= 0.1;
        if (this.energy <= 0) {
            const index = species.indexOf(this);
            if (index > -1) species.splice(index, 1);
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.type !== 'plant') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 2, 0, (this.energy / 100) * Math.PI * 2);
            ctx.strokeStyle = this.energy > 50 ? '#1a5d1a' : this.energy > 20 ? '#ff6b35' : '#e74c3c';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

class Threat {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 100;
        this.growthRate = 2;
        this.active = true;
    }
    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.growthRate;
        } else {
            this.active = false;
        }
        species.forEach(spec => {
            const dx = spec.x - this.x;
            const dy = spec.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.radius + spec.size) {
                spec.energy -= 5;
                if (Math.random() < 0.1) {
                    const index = species.indexOf(spec);
                    if (index > -1) species.splice(index, 1);
                }
            }
        });
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function initializeEcosystem() {
    species = [];
    for (let i = 0; i < 20; i++) {
        species.push(new Species('plant', Math.random() * ecosystemCanvas.width, Math.random() * ecosystemCanvas.height));
    }
    for (let i = 0; i < 8; i++) {
        species.push(new Species('herbivore', Math.random() * ecosystemCanvas.width, Math.random() * ecosystemCanvas.height));
    }
    for (let i = 0; i < 3; i++) {
        species.push(new Species('carnivore', Math.random() * ecosystemCanvas.width, Math.random() * ecosystemCanvas.height));
    }
    threats = [];
    ecosystemHealth = 100;
}

function drawEcosystem() {
    ctx.clearRect(0, 0, ecosystemCanvas.width, ecosystemCanvas.height);
    ctx.fillStyle = '#E8F5E9';
    ctx.fillRect(0, 0, ecosystemCanvas.width, ecosystemCanvas.height);
    species.forEach(spec => spec.draw());
    threats.forEach(threat => threat.draw());
    ctx.fillStyle = ecosystemHealth > 70 ? '#1a5d1a' : ecosystemHealth > 40 ? '#ff6b35' : '#e74c3c';
    ctx.fillRect(10, 10, ecosystemHealth * 2, 20);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 200, 20);
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Ecosystem Health: ${Math.round(ecosystemHealth)}%`, 220, 25);
    const plantCount = species.filter(s => s.type === 'plant').length;
    const herbivoreCount = species.filter(s => s.type === 'herbivore').length;
    const carnivoreCount = species.filter(s => s.type === 'carnivore').length;
    ctx.fillText(`Plants: ${plantCount}`, 10, 50);
    ctx.fillText(`Herbivores: ${herbivoreCount}`, 10, 70);
    ctx.fillText(`Carnivores: ${carnivoreCount}`, 10, 90);
}

function updateEcosystem() {
    species.forEach(spec => spec.update());
    threats.forEach((threat, index) => {
        threat.update();
        if (!threat.active) threats.splice(index, 1);
    });
    const totalSpecies = species.length;
    const plantCount = species.filter(s => s.type === 'plant').length;
    const herbivoreCount = species.filter(s => s.type === 'herbivore').length;
    const carnivoreCount = species.filter(s => s.type === 'carnivore').length;
    const maxSpecies = 50;
    const diversityScore = (plantCount > 0 ? 1 : 0) + (herbivoreCount > 0 ? 1 : 0) + (carnivoreCount > 0 ? 1 : 0);
    ecosystemHealth = Math.min(100, (totalSpecies / maxSpecies) * 70 + (diversityScore / 3) * 30);
    drawEcosystem();
}

document.getElementById('addSpecies').addEventListener('click', () => {
    const types = ['plant', 'herbivore', 'carnivore'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    species.push(new Species(randomType, Math.random() * ecosystemCanvas.width, Math.random() * ecosystemCanvas.height));
});
document.getElementById('removeSpecies').addEventListener('click', () => {
    if (species.length > 0) species.splice(Math.floor(Math.random() * species.length), 1);
});
document.getElementById('simulateThreat').addEventListener('click', () => {
    threats.push(new Threat(Math.random() * ecosystemCanvas.width, Math.random() * ecosystemCanvas.height));
});
document.getElementById('resetEcosystem').addEventListener('click', initializeEcosystem);

initializeEcosystem();
setInterval(updateEcosystem, 50);

// Interactive Species Explorer - UPDATED WITH images/ PATH
const speciesData = [
    { 
        name: "Sumatran Tiger", 
        status: "Critically Endangered", 
        image: "images/sumatran-tiger.jpg", 
        description: "The Sumatran tiger is the smallest of all tiger subspecies and is found only on the Indonesian island of Sumatra. With fewer than 400 individuals remaining in the wild, it is critically endangered due to habitat loss and poaching.", 
        population: "Decreasing", 
        threats: "Habitat loss, poaching, human-wildlife conflict", 
        efforts: "Protected areas, anti-poaching patrols, community education" 
    },
    { 
        name: "Black Rhinoceros", 
        status: "Critically Endangered", 
        image: "images/black-rhino.jpg", 
        description: "The black rhinoceros is native to eastern and southern Africa. Despite its name, it is actually gray in color. It is critically endangered due to poaching for its horn, which is highly valued in traditional medicine.", 
        population: "Increasing", 
        threats: "Poaching, habitat loss", 
        efforts: "Anti-poaching measures, habitat protection, breeding programs" 
    },
    { 
        name: "Mountain Gorilla", 
        status: "Endangered", 
        image: "images/mountain-gorilla.jpg", 
        description: "Mountain gorillas are found in the volcanic mountains of Central Africa. They have thicker fur than other gorillas, allowing them to live at higher altitudes. Conservation efforts have helped increase their population in recent years.", 
        population: "Increasing", 
        threats: "Habitat loss, poaching, disease", 
        efforts: "Protected areas, tourism regulation, veterinary care" 
    },
    { 
        name: "Hawksbill Sea Turtle", 
        status: "Critically Endangered", 
        image: "images/hawksbill-turtle.jpg", 
        description: "The hawksbill sea turtle is found in tropical reefs of the Indian, Pacific, and Atlantic Oceans. It is named for its narrow, pointed beak. It is critically endangered due to hunting for its beautiful shell and habitat loss.", 
        population: "Decreasing", 
        threats: "Poaching, habitat loss, climate change", 
        efforts: "Protected nesting beaches, fishing regulations, awareness campaigns" 
    },
    { 
        name: "Blue Whale", 
        status: "Endangered", 
        image: "images/blue-whale.jpg", 
        description: "The blue whale is the largest animal ever known to have existed. It can reach lengths of up to 100 feet and weigh as much as 200 tons. Despite being protected, it remains endangered due to historical whaling and current threats like ship strikes.", 
        population: "Increasing", 
        threats: "Ship strikes, entanglement, noise pollution", 
        efforts: "Shipping lane adjustments, protected areas, research" 
    },
    { 
        name: "Polar Bear", 
        status: "Vulnerable", 
        image: "images/polar-bear.jpg", 
        description: "Polar bears are the largest land carnivores and are uniquely adapted to life in the Arctic. They depend on sea ice to hunt seals, their primary food source. Climate change is causing rapid loss of their sea ice habitat.", 
        population: "Decreasing", 
        threats: "Climate change, pollution, oil exploration", 
        efforts: "Climate action, protected areas, research" 
    }
];

const speciesGrid = document.getElementById('speciesGrid');
speciesData.forEach((species, index) => {
    const card = document.createElement('div');
    card.className = 'species-card';
    card.innerHTML = `
        <div class="species-image" style="background-image: url('${species.image}')">
            <div class="species-overlay">
                <div class="species-name">${species.name}</div>
                <div class="species-status">${species.status}</div>
            </div>
        </div>
        <div class="species-details"><p>${species.description.substring(0, 100)}...</p></div>
    `;
    card.addEventListener('click', () => openSpeciesModal(index));
    speciesGrid.appendChild(card);
});

const speciesModal = document.getElementById('speciesModal');
const closeSpeciesModal = document.getElementById('closeSpeciesModal');

function openSpeciesModal(index) {
    const species = speciesData[index];
    document.getElementById('modalSpeciesName').textContent = species.name;
    document.getElementById('modalSpeciesImage').style.backgroundImage = `url('${species.image}')`;
    document.getElementById('modalSpeciesDescription').textContent = species.description;
    document.getElementById('modalSpeciesStatus').textContent = species.status;
    document.getElementById('modalSpeciesTrend').textContent = species.population;
    document.getElementById('modalSpeciesThreats').textContent = species.threats;
    document.getElementById('modalSpeciesEfforts').textContent = species.efforts;
    speciesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

closeSpeciesModal.addEventListener('click', () => {
    speciesModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});
speciesModal.addEventListener('click', (e) => {
    if (e.target === speciesModal) {
        speciesModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Interactive Impact Calculator
const calculateBtn = document.getElementById('calculateImpact');
calculateBtn.addEventListener('click', () => {
    const forestArea = parseInt(document.getElementById('forestArea').value) || 0;
    const speciesLost = parseInt(document.getElementById('speciesLost').value) || 0;
    const pollutionLevel = parseInt(document.getElementById('pollutionLevel').value) || 1;
    const co2Lost = forestArea * 6;
    const economicCost = forestArea * 5000 + speciesLost * 100000;
    const recoveryTime = Math.max(10, forestArea / 100 + speciesLost * 5);
    const ecosystemHealth = Math.max(0, 100 - (forestArea / 100) - (speciesLost * 10) - (pollutionLevel * 5));
    document.getElementById('co2Result').textContent = co2Lost.toLocaleString() + ' tons/year';
    document.getElementById('economicResult').textContent = '$' + economicCost.toLocaleString();
    document.getElementById('recoveryResult').textContent = recoveryTime.toFixed(1) + ' years';
    document.getElementById('healthResult').textContent = ecosystemHealth.toFixed(1) + '%';
});

// Quiz functionality
const quizIntro = document.getElementById('quizIntro');
const quizContent = document.getElementById('quizContent');
const quizResults = document.getElementById('quizResults');
const startQuizBtn = document.getElementById('startQuiz');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const quizFeedback = document.getElementById('quizFeedback');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackText = document.getElementById('feedbackText');
const nextQuestionBtn = document.getElementById('nextQuestion');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const scoreValue = document.getElementById('scoreValue');
const scorePercentage = document.getElementById('scorePercentage');
const resultsMessage = document.getElementById('resultsMessage');
const retryQuizBtn = document.getElementById('retryQuiz');

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let shuffledQuestions = [];

const quizQuestions = [
    { question: "What percentage of global food crops rely on pollinators?", options: ["25%", "50%", "75%", "90%"], correctAnswer: 2, explanation: "Over 75% of global food crops rely on pollinators, contributing US$ 235–577 billion annually to global agricultural output." },
    { question: "Which of these is NOT a major threat to biodiversity?", options: ["Habitat destruction", "Climate change", "Overexploitation", "Solar energy"], correctAnswer: 3, explanation: "Solar energy is a renewable energy source and not a threat to biodiversity." },
    { question: "How many species are currently facing extinction according to the UN?", options: ["100,000", "500,000", "1 million", "5 million"], correctAnswer: 2, explanation: "According to the United Nations, more than 1 million species are currently facing extinction." },
    { question: "What percentage of emerging infectious diseases are zoonotic?", options: ["25%", "50%", "75%", "90%"], correctAnswer: 2, explanation: "Over 75% of emerging infectious diseases are zoonotic." },
    { question: "Which ecosystem stores the most terrestrial biodiversity?", options: ["Deserts", "Grasslands", "Forests", "Oceans"], correctAnswer: 2, explanation: "Forests store 80% of terrestrial biodiversity." },
    { question: "What is the estimated annual economic impact of biodiversity loss?", options: ["$1 trillion", "$5 trillion", "$10 trillion", "$20 trillion"], correctAnswer: 2, explanation: "The global economic impact of biodiversity loss amounts to US$ 10 trillion annually." },
    { question: "Which group manages nearly 40% of all protected areas globally?", options: ["Government agencies", "Private corporations", "Indigenous Peoples", "International NGOs"], correctAnswer: 2, explanation: "Indigenous Peoples manage over 38 million km² of land globally, including nearly 40% of all protected areas." },
    { question: "What percentage of modern medicines are derived from natural sources?", options: ["25%", "50%", "75%", "90%"], correctAnswer: 1, explanation: "Over 50% of modern medicines are derived from natural sources." },
    { question: "Which international agreement set targets to protect 30% of the planet by 2030?", options: ["Paris Agreement", "Kyoto Protocol", "Kunming-Montreal Framework", "Copenhagen Accord"], correctAnswer: 2, explanation: "The Kunming-Montreal Global Biodiversity Framework set the target to protect 30% of the planet by 2030." },
    { question: "What is the 'One Health' approach?", options: ["Focusing only on human health", "A holistic approach linking animal, human, and environmental health", "A diet plan for better health", "A technology for health monitoring"], correctAnswer: 1, explanation: "The 'One Health' approach recognizes the indivisible link between animal, human, and environmental well-being." },
    { question: "What percentage of Earth's land is now considered degraded?", options: ["15%", "25%", "33%", "50%"], correctAnswer: 2, explanation: "One-third (33%) of the planet's land is now degraded." },
    { question: "Which of these contributes to 60% of species extinctions?", options: ["Climate change", "Invasive alien species", "Pollution", "Overfishing"], correctAnswer: 1, explanation: "Invasive alien species contribute to 60% of species extinctions." },
    { question: "Since 1970, what percentage of wetlands have been lost globally?", options: ["15%", "25%", "35%", "45%"], correctAnswer: 2, explanation: "Since 1970, 35% of wetlands have been lost globally." },
    { question: "What is the primary cause of zoonotic spillover?", options: ["Climate change", "Habitat destruction bringing humans and wildlife into closer contact", "Air pollution", "Genetic modification of crops"], correctAnswer: 1, explanation: "Habitat destruction brings humans and wildlife into closer contact, increasing pathogen spillover." },
    { question: "Which technology is revolutionizing healthcare by providing continuous monitoring?", options: ["Telemedicine", "Wearable health technology", "Robotic surgery", "mRNA technology"], correctAnswer: 1, explanation: "Wearable health technology provides continuous monitoring and early detection." },
    { question: "What does STS stand for in the context of biodiversity?", options: ["Science, Technology, Society", "Systematic Technical Solutions", "Sustainable Technology Systems", "Scientific Technical Standards"], correctAnswer: 0, explanation: "STS stands for Science, Technology, and Society." },
    { question: "Which of these is a key solution to protect biodiversity mentioned in the website?", options: ["Increasing industrial agriculture", "Protecting and restoring natural habitats", "Expanding urban development", "Promoting single-use plastics"], correctAnswer: 1, explanation: "Protecting and restoring natural habitats is a key solution." },
    { question: "What is the main focus of the Amazon Rainforest case study?", options: ["Economic benefits of deforestation", "Record levels of deforestation threatening biodiversity", "Success of agricultural expansion", "Urban development opportunities"], correctAnswer: 1, explanation: "The Amazon case study focuses on deforestation threatening biodiversity." },
    { question: "Which of these is NOT a level of biodiversity?", options: ["Genetic diversity", "Species diversity", "Ecosystem diversity", "Economic diversity"], correctAnswer: 3, explanation: "The three main levels are genetic, species, and ecosystem diversity." },
    { question: "What role does technology play in biodiversity conservation?", options: ["It has no significant role", "It offers tools for monitoring and mitigation", "It primarily focuses on economic development", "It replaces the need for conservation efforts"], correctAnswer: 1, explanation: "Technology offers tools for monitoring, mitigation, and conservation solutions." }
];

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function shuffleQuiz() {
    shuffledQuestions = shuffleArray(quizQuestions);
    shuffledQuestions = shuffledQuestions.map(question => {
        const optionIndices = question.options.map((_, index) => index);
        const shuffledIndices = shuffleArray(optionIndices);
        const shuffledOptions = shuffledIndices.map(index => question.options[index]);
        const newCorrectAnswer = shuffledIndices.indexOf(question.correctAnswer);
        return { ...question, options: shuffledOptions, correctAnswer: newCorrectAnswer };
    });
}

startQuizBtn.addEventListener('click', () => {
    shuffleQuiz();
    quizIntro.style.display = 'none';
    quizContent.style.display = 'block';
    loadQuestion();
});

function loadQuestion() {
    const question = shuffledQuestions[currentQuestion];
    questionText.textContent = question.question;
    const progress = ((currentQuestion) / shuffledQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${shuffledQuestions.length}`;
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });
    quizFeedback.style.display = 'none';
}

function selectOption(e) {
    const selectedOption = e.target;
    const selectedIndex = parseInt(selectedOption.dataset.index);
    const question = shuffledQuestions[currentQuestion];
    const allOptions = optionsContainer.querySelectorAll('.option');
    allOptions.forEach(option => { option.style.pointerEvents = 'none'; });
    const isCorrect = selectedIndex === question.correctAnswer;
    if (isCorrect) {
        selectedOption.classList.add('correct');
        score++;
        scoreValue.textContent = score;
    } else {
        selectedOption.classList.add('incorrect');
        allOptions[question.correctAnswer].classList.add('correct');
    }
    userAnswers.push({ question: question.question, userAnswer: selectedIndex, correctAnswer: question.correctAnswer, isCorrect: isCorrect });
    showFeedback(isCorrect, question.explanation);
}

function showFeedback(isCorrect, explanation) {
    quizFeedback.style.display = 'block';
    if (isCorrect) { feedbackTitle.textContent = 'Correct!'; feedbackTitle.className = 'correct'; }
    else { feedbackTitle.textContent = 'Incorrect'; feedbackTitle.className = 'incorrect'; }
    feedbackText.textContent = explanation;
}

nextQuestionBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < shuffledQuestions.length) loadQuestion();
    else showResults();
});

function createConfetti() {
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-canvas';
    document.body.appendChild(confettiCanvas);
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const confettiPieces = [];
    const colors = ['#1a5d1a', '#2e8b2e', '#ff6b35', '#3498db', '#e74c3c'];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let activePieces = 0;
        confettiPieces.forEach(piece => {
            piece.y += piece.speed;
            piece.rotation += piece.rotationSpeed;
            if (piece.y < confettiCanvas.height) {
                activePieces++;
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
                ctx.restore();
            }
        });
        if (activePieces > 0) requestAnimationFrame(animateConfetti);
        else setTimeout(() => { if (confettiCanvas.parentNode) confettiCanvas.parentNode.removeChild(confettiCanvas); }, 1000);
    }
    animateConfetti();
}

function showResults() {
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    scorePercentage.textContent = `${percentage}%`;
    let level, icon, title, description, badges, recommendations, message;
    if (percentage >= 90) {
        level = "expert"; icon = "fas fa-crown"; title = "Biodiversity Expert!";
        description = "Your knowledge about ecosystems and conservation is truly impressive.";
        badges = [{ text: "Ecosystem Expert", class: "expert" }, { text: "Conservation Champion", class: "expert" }];
        recommendations = ["Consider sharing your knowledge with others", "Get involved in local conservation efforts", "Explore advanced topics in ecological science"];
        message = "Excellent! You're a biodiversity expert!";
        createConfetti();
    } else if (percentage >= 70) {
        level = "advanced"; icon = "fas fa-seedling"; title = "Biodiversity Advocate!";
        description = "You have a solid understanding of biodiversity issues and their importance.";
        badges = [{ text: "Nature Advocate", class: "advanced" }, { text: "Eco-Learner", class: "advanced" }];
        recommendations = ["Explore our Threats section to deepen your knowledge", "Learn about local biodiversity in your area", "Consider reducing your ecological footprint"];
        message = "Great job! You have a solid understanding of biodiversity issues.";
        createConfetti();
    } else if (percentage >= 50) {
        level = "intermediate"; icon = "fas fa-leaf"; title = "Growing Knowledge!";
        description = "You know some key facts about biodiversity, but there's more to discover.";
        badges = [{ text: "Nature Explorer", class: "intermediate" }, { text: "Learning Journey", class: "intermediate" }];
        recommendations = ["Review the Key Facts section", "Learn about how biodiversity affects your daily life", "Try the quiz again after exploring the site"];
        message = "Good effort! You know some key facts about biodiversity.";
    } else {
        level = "beginner"; icon = "fas fa-heart"; title = "Getting Started!";
        description = "Don't worry! Biodiversity is a complex topic. Every expert was once a beginner.";
        badges = [{ text: "Nature Newcomer", class: "beginner" }, { text: "Learning Path", class: "beginner" }];
        recommendations = ["Start with the Overview section", "Check out the Key Facts for essential information", "Take the quiz again after exploring the site"];
        message = "Don't worry! Biodiversity is a complex topic. Explore our website to learn more.";
    }
    resultsMessage.textContent = message;
    const scoreFeedback = document.getElementById('scoreFeedback');
    scoreFeedback.className = `score-feedback ${level}`;
    scoreFeedback.innerHTML = `
        <div class="feedback-icon"><i class="${icon}"></i></div>
        <h3 class="feedback-title">${title}</h3>
        <p class="feedback-description">${description}</p>
        <div class="feedback-badges">${badges.map(badge => `<div class="badge ${badge.class}"><i class="fas fa-award"></i><span>${badge.text}</span></div>`).join('')}</div>
        <div class="recommendations"><h4>Recommended Next Steps:</h4><ul>${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul></div>
    `;
    saveableResults.innerHTML = `
        <div class="score-circle"><div class="circle-background"></div><div class="circle-content"><span class="score-percentage">${percentage}%</span><span class="score-label">Your Score</span></div></div>
        <div class="feedback-icon"><i class="${icon}"></i></div>
        <h3 class="feedback-title">${title}</h3>
        <p class="feedback-description">${description}</p>
        <div class="feedback-badges">${badges.map(badge => `<div class="badge ${badge.class}"><i class="fas fa-award"></i><span>${badge.text}</span></div>`).join('')}</div>
        <div class="recommendations"><h4>Recommended Next Steps:</h4><ul>${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul></div>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Quiz:</strong> Biodiversity Knowledge Assessment</p>
    `;
}

saveResultsBtnInQuiz.addEventListener('click', openSaveResultsModal);

retryQuizBtn.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    scoreValue.textContent = '0';
    shuffleQuiz();
    quizResults.style.display = 'none';
    quizContent.style.display = 'block';
    loadQuestion();
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            if (navMenu.classList.contains('active')) navMenu.classList.remove('active');
            searchBar.classList.remove('active');
        }
    });
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 100)) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// Add scroll effect to header
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
});