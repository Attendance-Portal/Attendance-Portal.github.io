$(document).ready(function(){
                
    async function face(){
        
        const MODEL_URL = 'models'

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
//        faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions)
//        faceapi.draw.drawFaceExpressions(canvas, faceDescriptions)

//, 'Kaushik.jpg', 'Kushagra.jpg', 'Ananya', 'AshutoshSingh',  ,'AyushDubey' ,'BaniSingh','Banoth', 'Harshit', 'Kaushik', 'gautam'
// , 'Sejal', 'Saumya', 'Shrivats', 'Suparna', 'Suchita', 'Srajan', 'Suchita', , 'Suparna'
        const labels = ['monika','khushboo', 'Kareena', 'Aarya', 'AaryaSuhas', 'Abhinav', 'AbhishekKumarSingh','Adarsh', 'Aditi', 'Advait', 'Amit',
        'Aniket', 'AnkitKumar', 'Aruprakash','Aryan', 'AryanGupta', 'AryanSrivastava', 'Aryman', 'Bharat', 'chandler', 'Chandu', 'Dev', 'Divyanth',
        'Lisha', 'Mudavath', 'Nikhil', 'Nunavath','Priyansh', 'Rachaprolu', 'Rajdeep', 'Rajitha', 'RajPrakash', 'Ritika', 'Rupsona', 'Samridhdi', 'Sandipam',
        'Sanskar', 'Sarthak', 'Sejal', 'ShantanuSingh', 'Shivam', 'Shweta','Srajan','Tejavath', 'Vansh','Vikas','Vinod', 'Vishal', 'Vishvender', 'Vivek', 'YuvrajJagdhane']

        const labeledFaceDescriptors = await Promise.all(
            labels.map(async label => {

                const imgUrl = `images/${label}.jpg`
                const img = await faceapi.fetchImage(imgUrl)

                const faceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                if (!faceDescription) {
                throw new Error(`no faces detected for ${label}`)
                }

                const faceDescriptors = [faceDescription.descriptor]
                return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
            })
        );

        const threshold = 0.6
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold)

        const results = faceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))

        results.forEach((bestMatch, i) => {
            const box = faceDescriptions[i].detection.box
            const text = bestMatch.toString()
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvas)
        })

    }
    
    face()
})
