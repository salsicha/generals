
var healthBar : GameObject;
var background : GameObject;

function Update () {
	//transform.LookAt(Camera.main.transform);
	//var t : Transform = 
	//var checkVector = transform.InverseTransformDirection(Camera.main.transform.position - transform.position); 
	
	//transformrotation = checkVector;
	//var rotation = Quaternion.LookRotation(Camera.main.transform.position - transform.position); 
	//print("rotation:" + rotation);
	//print("checkVector:" + checkVector);
	
	
	transform.LookAt(transform.position + Camera.main.transform.rotation * Vector3.back,
					Camera.main.transform.rotation * Vector3.up);
	
	//var v : Vector3 = Camera.main.transform.position - transform.position;
	//v.x = v.z = 0;
	//transform.LookAt(Camera.main.transform.position - v);
}

function SetHealthEnabled(enabled : boolean) {
	//print("SetHealthEnabled: " + enabled);
	
	gameObject.active = enabled;
	background.active = enabled;
	healthBar.active = enabled;
	
	// set once the look direction otherwise it will "pop" the first time it gets activated
	transform.LookAt(transform.position + Camera.main.transform.rotation * Vector3.back, 
					Camera.main.transform.rotation * Vector3.up);
}