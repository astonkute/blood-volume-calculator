document.addEventListener('DOMContentLoaded', function() {
    // Sample volumes by age group (ml)
    const sampleVolumes = {
        coag: {
            1: 5.8, // ≤1Y
            2: 5.8, // >1Y≤2Y
            3: 5.8, // >2Y≤6Y
            4: 6.0, // >6Y≤12Y
            5: 6.0  // >12Y
        },
        mim8pkpd: {
            1: 11.6,
            2: 11.6,
            3: 11.6,
            4: 10.8,
            5: 10.8
        },
        chemistry: {
            1: 1.1,
            2: 1.1,
            3: 2.2,
            4: 2.5,
            5: 2.5
        },
        hematology: {
            1: 1.2,
            2: 1.2,
            3: 1.2,
            4: 2.0,
            5: 2.0
        },
        fviii: {
            1: 2.9,
            2: 2.9,
            3: 2.9,
            4: 2.7,
            5: 0.0
        },
        plasmaBio: {
            1: 2.9,
            2: 2.9,
            3: 2.9,
            4: 2.7,
            5: 2.7
        },
        serumBio: {
            1: 2.4,
            2: 2.4,
            3: 2.4,
            4: 2.0,
            5: 2.0
        },
        wbBio: {
            1: 2.6,
            2: 2.6,
            3: 2.6,
            4: 2.0,
            5: 2.0
        }
    };

    // Visit-specific required samples
    const visitRequirements = {
        V2: ['coag', 'mim8pkpd'],
        V3: ['coag', 'mim8pkpd'],
        V4: ['coag', 'mim8pkpd'],
        V5: ['mim8pkpd'],
        V6: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii'],
        V8: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii'],
        V10: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii', 'plasmaBio', 'serumBio', 'wbBio'],
        V12: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii'],
        V14: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii', 'plasmaBio', 'serumBio', 'wbBio'],
        V16: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii'],
        V18: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii', 'plasmaBio', 'serumBio', 'wbBio'],
        V20: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii'],
        V22: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii', 'plasmaBio', 'serumBio', 'wbBio'],
        V24: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii'],
        V26: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii', 'plasmaBio', 'serumBio', 'wbBio'],
        EOT: ['coag', 'mim8pkpd', 'chemistry', 'hematology', 'fviii']
    };

    function calculateMaxAllowed(weight) {
        return (weight * 80) / 100;
    }

    function calculateMax28Days(weight) {
        return (weight * 80) / 33;
    }

    function getSampleLabel(sampleId) {
        const labels = {
            coag: 'Coagulation parameters (aPTT, fibrinogen, d-dimer, prothrombin fragments 1+2)',
            mim8pkpd: 'Mim8 PK/PD, TGT, AB, FIX/FX antigen',
            chemistry: 'Chemistry',
            hematology: 'Hematology',
            fviii: 'FVIII inhibitor',
            plasmaBio: 'Biosamples Future Research Plasma',
            serumBio: 'Biosamples Future Research Serum',
            wbBio: 'Biosamples Future Research WB'
        };
        return labels[sampleId];
    }

    function updateVisitSamples() {
        const visit = document.getElementById('visit').value;
        const samplesDiv = document.getElementById('visitSamples');
        samplesDiv.innerHTML = '';

        const requiredSamples = visitRequirements[visit];
        requiredSamples.forEach(sample => {
            const div = document.createElement('div');
            div.className = 'sample-item';
            div.innerHTML = `
                <input type="checkbox" id="${sample}" class="sample-checkbox">
                <label for="${sample}">${getSampleLabel(sample)}</label>
            `;
            samplesDiv.appendChild(div);
            
            document.getElementById(sample).addEventListener('change', updateCalculations);
        });
        
        updateCalculations();
    }

    function calculateTotalVolume(ageGroup, visit) {
        let total = 0;
        const requiredSamples = visitRequirements[visit];
        
        requiredSamples.forEach(sample => {
            const checkbox = document.getElementById(sample);
            if (checkbox && checkbox.checked) {
                total += sampleVolumes[sample][ageGroup];
            }
        });
        return total;
    }

    function updateCalculations() {
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        const ageGroup = document.getElementById('ageGroup').value;
        const visit = document.getElementById('visit').value;
        
        const totalVolume = calculateTotalVolume(ageGroup, visit);
        const maxAllowed = calculateMaxAllowed(weight);
        const maxAllowed28 = calculateMax28Days(weight);

        document.getElementById('totalVolume').textContent = totalVolume.toFixed(1);
        document.getElementById('maxAllowed').textContent = maxAllowed.toFixed(1);
        document.getElementById('maxAllowed28').textContent = maxAllowed28.toFixed(1);

        // Update sample breakdown
        const breakdownDiv = document.getElementById('sampleBreakdown');
        breakdownDiv.innerHTML = '<h4>Sample Volume Breakdown:</h4>';
        
        const requiredSamples = visitRequirements[visit];
        requiredSamples.forEach(sample => {
            const checkbox = document.getElementById(sample);
            if (checkbox && checkbox.checked) {
                const volume = sampleVolumes[sample][ageGroup];
                breakdownDiv.innerHTML += `
                    <div class="breakdown-item">
                        ${getSampleLabel(sample)}: ${volume.toFixed(1)} ml
                    </div>
                `;
            }
        });

        // Update warning message
        const warningMessage = document.getElementById('warningMessage');
        if (totalVolume > maxAllowed) {
            warningMessage.innerHTML = 'WARNING: Volume exceeds maximum allowed for single visit!';
            warningMessage.className = 'warning';
        } else if (totalVolume > maxAllowed28) {
            warningMessage.innerHTML = 'WARNING: Volume exceeds maximum allowed for 28-day period!';
            warningMessage.className = 'warning';
        } else if (totalVolume > 0) {
            warningMessage.innerHTML = 'Volume is within allowed limits';
            warningMessage.className = '';
        } else {
            warningMessage.innerHTML = '';
        }
    }

    // Select All functionality
    document.getElementById('selectAll').addEventListener('click', function() {
        const visit = document.getElementById('visit').value;
        const requiredSamples = visitRequirements[visit];
        
        requiredSamples.forEach(sample => {
            const checkbox = document.getElementById(sample);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        updateCalculations();
    });

    // Add event listeners
    document.getElementById('weight').addEventListener('input', updateCalculations);
    document.getElementById('ageGroup').addEventListener('change', updateCalculations);
    document.getElementById('visit').addEventListener('change', updateVisitSamples);

    // Initial update
    updateVisitSamples();
});
git add .
git commit -m "Updated calculator files"
git push origin main
