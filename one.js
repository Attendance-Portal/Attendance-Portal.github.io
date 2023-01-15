$(document).ready(function(){
                
    async function face(){
        
        const MODEL_URL = '/models'

        await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
        await faceapi.loadFaceLandmarkModel(MODEL_URL)
        await faceapi.loadFaceRecognitionModel(MODEL_URL)
        await faceapi.loadFaceExpressionModel(MODEL_URL)

        const img= document.getElementById('originalImg')
        let faceDescriptions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
        const canvas = $('#reflay').get(0)
        faceapi.matchDimensions(canvas, img)

        faceDescriptions = faceapi.resizeResults(faceDescriptions, img)
        faceapi.draw.drawDetections(canvas, faceDescriptions)
        faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions)
        faceapi.draw.drawFaceExpressions(canvas, faceDescriptions)

        const labels = ['monika','khushboo','Kareena', 'Aarya', 'AaryaSuhas', 'Abhinav', 'AbhishekKumarSingh','Adarsh', 'Aditi', 'Advait', 'Amit','Aniket', 
                        'AnkitKumar', 'Aruprakash','Aryan', 'AryanGupta', 'AryanSrivastava', 'Aryman', 'Bharat', 'chandler', 'Chandu', 'Dev', 'Divyanth',
                        'Lisha', 'Mudavath', 'Nikhil', 'Nunavath','Priyansh', 'Rachaprolu', 'Rajdeep', 'Rajitha', 'RajPrakash', 'Ritika', 'Rupsona', 
                        'Samridhdi', 'Sandipam','Sanskar', 'Sarthak']

        const labeledFaceDescriptors = await Promise.all(
            labels.map(async label => {

                const imgUrl = 'images/${label}.jpg'
                const img = await faceapi.fetchImage(imgUrl)

                const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                if (!faceDescription) {
                throw new Error('no faces detected for ${label}')
                }

                const faceDescriptors = [faceDescription.descriptor]
                return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
            })
        );

        const threshold = 0.6
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold)
        const table = document.getElementById("testBody");
        const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
        j=100;
        let row = table.insertRow();
        let date = row.insertCell(0);
        let name = row.insertCell(1);
        edit = row.insertCell(2);
        save = row.insertCell(3);
        results.forEach((bestMatch, i) => {
            const box = faceDescriptions[i].detection.box
            const text = i.toString()+" "+bestMatch.toString()
            date.innerHTML = i.toString();
            name.innerHTML = bestMatch.toString();
            edit.innerHTML = "edit";
            save.innerHTML = "ok" 
            document.write(text)
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvas)
        })

    }
    
    face()
})
