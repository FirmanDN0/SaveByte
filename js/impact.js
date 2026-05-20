document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INTERACTIVE SUSTAINABILITY CARBON CALCULATOR
       ========================================================================== */
    const mealsSlider = document.getElementById('calc-meals');
    const valBubble = document.getElementById('calc-val-bubble');
    
    const co2Val = document.getElementById('calc-co2-val');
    const moneyVal = document.getElementById('calc-money-val');
    const treesVal = document.getElementById('calc-trees-val');
    
    const treesGrid = document.querySelector('.trees-grid');

    const treeSVG = `
        <svg class="tree-icon" viewBox="0 0 24 24">
            <path d="M12 2L4 12h3v8h10v-8h3L12 2zm-1 16H9v-2h2v2zm0-4H9v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
        </svg>
    `;

    function updateCalculator() {
        if (!mealsSlider) return;

        const weeklyMeals = parseInt(mealsSlider.value);
        valBubble.textContent = `${weeklyMeals} ${weeklyMeals === 1 ? 'meal' : 'meals'}`;

        // Annual Calculations
        // 1 Rescued meal avoids roughly 2.5 kg carbon gas greenhouse emissions
        const co2Saved = Math.round(weeklyMeals * 52 * 2.5);
        // Average Rp 35.000 discount savings compared to typical retail price
        const moneySaved = Math.round(weeklyMeals * 52 * 35000);
        // 1 Tree absorbs ~22 kg CO2 per year
        const treesSaved = Math.round(co2Saved / 22);

        // Populate values dynamically
        if (co2Val) co2Val.textContent = `${co2Saved.toLocaleString('id-ID')} kg`;
        
        if (moneyVal) {
            if (moneySaved >= 1000000) {
                moneyVal.textContent = `Rp ${(moneySaved / 1000000).toFixed(1)}M`;
            } else {
                moneyVal.textContent = `Rp ${(moneySaved / 1000).toFixed(0)}K`;
            }
        }
        
        if (treesVal) treesVal.textContent = treesSaved.toString();

        // Render Sprouted Trees cascadingly
        if (treesGrid) {
            treesGrid.innerHTML = '';
            
            // Limit render array size to avoid layout breakage
            const renderCount = Math.min(treesSaved, 36);
            for (let i = 0; i < renderCount; i++) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = treeSVG;
                const node = wrapper.firstElementChild;
                
                // Add staggered animation delay
                node.style.animationDelay = `${i * 45}ms`;
                treesGrid.appendChild(node);
            }
        }
        
        // Re-apply Awwwards contextual cursor indicators
        if (window.refreshCursorListeners) window.refreshCursorListeners();
    }

    if (mealsSlider) {
        mealsSlider.addEventListener('input', updateCalculator);
        // Initial setup run
        updateCalculator();
    }

    /* ==========================================================================
       2. PURE HTML5 CANVAS CHARTS ENGINE
       ========================================================================== */
    const barCanvas = document.getElementById('monthly-bar-chart');
    const doughnutCanvas = document.getElementById('category-doughnut-chart');

    // Chart Options & Palette Data
    const themeColors = {
        primary: '#165A42',       // Deep emerald
        primaryLight: '#E6F2EC',  // Soft mint
        accent: '#FF6F43',        // Peach-orange
        accentDark: '#E05327',
        textDark: '#12241E',
        greyMedium: '#CAD5CF'
    };

    function initCharts() {
        if (barCanvas) {
            renderBarChart(barCanvas);
        }
        if (doughnutCanvas) {
            renderDoughnutChart(doughnutCanvas);
        }
    }

    /* --- Bar Chart 2D Renderer --- */
    function renderBarChart(canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        // Handle High-DPI screen sharp renders
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 320 * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = 300;
        
        // Dataset (Monthly rescued kgs)
        const data = [140, 280, 420, 710, 1050, 1420];
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Chart Boundaries
        const chartTop = 30;
        const chartBottom = height - 40;
        const chartLeft = 50;
        const chartRight = width - 20;
        const chartHeight = chartBottom - chartTop;
        const chartWidth = chartRight - chartLeft;

        // Draw horizontal grid lines
        const gridCount = 5;
        const maxVal = 1600;
        ctx.strokeStyle = '#EEF2F0';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#536C62';
        ctx.font = '500 11px Outfit';
        ctx.textAlign = 'right';

        for (let i = 0; i <= gridCount; i++) {
            const val = (maxVal / gridCount) * i;
            const y = chartBottom - (chartHeight * (val / maxVal));
            
            ctx.beginPath();
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartRight, y);
            ctx.stroke();
            
            ctx.fillText(val + ' kg', chartLeft - 10, y + 4);
        }

        // Draw Bars
        const barWidth = 32;
        const gap = (chartWidth - (barWidth * data.length)) / (data.length - 1);

        data.forEach((val, i) => {
            const barHeight = chartHeight * (val / maxVal);
            const x = chartLeft + i * (barWidth + gap);
            const y = chartBottom - barHeight;

            // Emerald Green Fill Gradient
            const gradient = ctx.createLinearGradient(x, y, x, chartBottom);
            gradient.addColorStop(0, themeColors.accent);
            gradient.addColorStop(1, themeColors.primary);

            // Draw rounded bar
            ctx.fillStyle = gradient;
            drawRoundedRect(ctx, x, y, barWidth, barHeight, 6);
            ctx.fill();

            // Label text
            ctx.fillStyle = themeColors.textDark;
            ctx.font = '700 12px Outfit';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x + barWidth / 2, chartBottom + 20);

            // Value text above bar
            ctx.font = '800 11px Outfit';
            ctx.fillStyle = themeColors.primary;
            ctx.fillText(val, x + barWidth / 2, y - 8);
        });
    }

    /* --- Doughnut Chart 2D Renderer --- */
    function renderDoughnutChart(canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = 320 * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = 300;
        
        const data = [40, 25, 20, 15]; // Percentages
        const labels = ["Bakery & Bread", "Restaurant Meals", "Buffet Platters", "Fresh Grocery"];
        const colors = [themeColors.primary, themeColors.accent, '#2E8A68', '#FFA180'];

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2 - 60;
        const centerY = height / 2;
        const radius = 80;
        const innerRadius = 50;

        let startAngle = -Math.PI / 2;

        // Draw doughnut slices
        data.forEach((percent, i) => {
            const sliceAngle = (percent / 100) * (Math.PI * 2);
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
            ctx.closePath();

            ctx.fillStyle = colors[i];
            ctx.fill();

            startAngle = endAngle;
        });

        // Draw centered aggregate text
        ctx.fillStyle = themeColors.textDark;
        ctx.textAlign = 'center';
        ctx.font = '800 20px Outfit';
        ctx.fillText('100%', centerX, centerY + 2);
        ctx.font = '600 11px Outfit';
        ctx.fillStyle = '#536C62';
        ctx.fillText('Saved Category', centerX, centerY + 18);

        // Draw Legend labels at the right side
        const legendX = centerX + radius + 30;
        const legendYStart = centerY - 50;
        
        ctx.textAlign = 'left';
        ctx.font = '700 12px Outfit';

        labels.forEach((label, i) => {
            const y = legendYStart + i * 26;
            
            // Color marker pill
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(legendX, y - 4, 6, 0, Math.PI * 2);
            ctx.fill();

            // Label text
            ctx.fillStyle = themeColors.textDark;
            ctx.fillText(`${label} (${data[i]}%)`, legendX + 16, y);
        });
    }

    // Helper: Rounded Rectangle Drawer
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // Trigger canvas drawing on window loads
    initCharts();

    // Redraw charts dynamically on window resizes to ensure perfect responsiveness
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initCharts();
        }, 150);
    });

});
