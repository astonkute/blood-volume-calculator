document.addEventListener('DOMContentLoaded', function() {
    // Sample volumes by age group
    const sampleVolumes = {
        coag: {
            1: 5.8, // ≤1Y
            2: 5.8, // >1Y≤2Y
            3: 6.0, // >2Y≤6Y
            4: 6.0, // >6Y≤12Y
            5: 6.0  // >12Y
        },
        mim8: {
            1: 11.6,
            2: 11.6,
            3: 10.8,
            4: 10.8,
            5: 10.8
        }
        // Add more samples as needed
    };

    function calculateMaxAllowed(weight) {
        return (weight * 80) / 100;
    }

    function updateCalculations() {
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        const ageGroup = document.getElementById('ageGroup').value;
        const totalVolume = calculateTotalVolume(ageGroup);
        const maxAllowed = calculateMaxAllowed(weight);

        document.getElementById('totalVolume').textContent = totalVolume.toFixed(1);
        document.getElementById('maxAllowed').textContent = maxAllowed.toFixed(1);

        const warningMessage = document.getElementById('warningMessage');
        if (totalVolume > maxAllowed) {
            warningMessage.textContent = 'WARNING: Volume exceeds maximum allowed!';
            warningMessage.className = 'warning';
        } else {
            warningMessage.textContent = 'Volume is within allowed limits';
            warningMessage.className = '';
        }
    }

    function calculateTotalVolume(ageGroup) {
        let total = 0;
        if (document.getElementById('coag').checked) {
            total += sampleVolumes.coag[ageGroup];
        }
        if (document.getElementById('mim8').checked) {
            total += sampleVolumes.mim8[ageGroup];
        }
        return total;
    }

    // Add event listeners
    document.getElementById('weight').addEventListener('input', updateCalculations);
    document.getElementById('ageGroup').addEventListener('change', updateCalculations);
    document.getElementById('coag').addEventListener('change', updateCalculations);
    document.getElementById('mim8').addEventListener('change', updateCalculations);
});
