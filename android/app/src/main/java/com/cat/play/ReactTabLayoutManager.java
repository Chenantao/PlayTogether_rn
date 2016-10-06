package com.cat.play;

import android.graphics.Color;
import android.support.design.widget.TabLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by ChenAt on 2016/9/29.
 * desc
 */

public class ReactTabLayoutManager extends SimpleViewManager<TabLayout> {

	@Override
	public String getName() {
		return "RCTTabLayout";
	}

	@Override
	protected TabLayout createViewInstance(final ThemedReactContext reactContext) {
		final TabLayout tabLayout = new TabLayout(reactContext);
		tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
			@Override
			public void onTabSelected(TabLayout.Tab tab) {
				WritableMap event = Arguments.createMap();
				event.putString("position", tab.getPosition() + "");
				reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
					tabLayout.getId(), "topChange", event);
			}

			@Override
			public void onTabUnselected(TabLayout.Tab tab) {
			}

			@Override
			public void onTabReselected(TabLayout.Tab tab) {
			}
		});
		return tabLayout;
	}

	@ReactProp(name = "setTabs")
	public void setTabs(TabLayout tabLayout, ReadableArray tabs) {
		tabLayout.removeAllTabs();
		int size = tabs.size();
		for (int i = 0; i < size; i++) {
			TabLayout.Tab tab = tabLayout.newTab();
			tab.setText(tabs.getString(i));
			tabLayout.addTab(tab);
		}
	}

	@ReactProp(name = "setTabTextColor")
	public void setTabTextColor(TabLayout tabLayout, ReadableArray colors) {
		try {
			tabLayout.setTabTextColors(
				Color.parseColor(colors.getString(0)),
				Color.parseColor(colors.getString(1)));
		} catch (Exception e) {
		}

	}

	@ReactProp(name = "setIndicatorColor")
	public void setIndicatorColor(TabLayout tabLayout, String color) {
		try {
			tabLayout.setSelectedTabIndicatorColor(Color.parseColor(color));
		} catch (Exception e) {
		}
	}


	@ReactProp(name = "selectTab", defaultInt = 0)
	public void selectTab(TabLayout tabLayout, int pos) {
		try {
			tabLayout.getTabAt(pos).select();
		} catch (Exception e) {
		}
	}


}
