var explosionTime = 2.0; 
var audioPitchRange = 0.3;

function Start() {	
	Destroy (gameObject, explosionTime); 
	audio.pitch = 1.0 + Random.Range(-audioPitchRange, audioPitchRange);
	//print("pitch: " + audio.pitch);
	audio.Play();	
}