package com.cat.play;

import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

import static java.util.Arrays.asList;

/**
 * Created by ChenAt on 2016/9/29.
 * desc
 */

public class MyReactPackage implements com.facebook.react.ReactPackage {

	@Override
	public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
		return null;
	}

	@Override
	public List<Class<? extends JavaScriptModule>> createJSModules() {
		return null;
	}

	@Override
	public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
	}
}
