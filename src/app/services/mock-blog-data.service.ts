import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Blog } from '../blog';

/**
 * Mock service that returns a curated list of realistic blog posts so the
 * UI can be developed without a running backend.  The data covers the three
 * primary topics: Planting, Cooking, and Programming.
 */
@Injectable({
  providedIn: 'root',
})
export class MockBlogDataService {
  /**
   * Return an Observable wrapping an array of mocked blog posts.  The posts
   * are sorted newest-first (most recent date first) so the UI logic that
   * picks a “featured post” works as expected.
   */
  getBlogData(): Observable<Blog[]> {
    const blogs: Blog[] = [
      {
        _id: 'p20250801',
        title: 'Debugging a Memory Leak in my Rust Micro-service',
        story: 'Programming',
        date: '2025-08-01',
        text:
          'Last night I noticed a steady increase in memory usage on the blog-server. \
After attaching `tokio-console` and running `valgrind`, I discovered a subtle \
clone of a large BSON document on every request.  I refactored the handler to \
borrow the payload instead of cloning it, reducing peak RSS by 65 %.  This post \
walks through the profiling steps, the refactor, and some handy tips for keeping \
Rocket-based services lean.',
        files: [
          'assets/img/posts/rust-leak-graph.png',
          'assets/img/posts/rust-profiler.png',
        ],
      },
      {
        _id: 'c20250729',
        title: 'Homemade Pesto: From Balcony Basil to Jar',
        story: 'Cooking',
        date: '2025-07-29',
        text:
          'My Genovese basil went wild this month, so I harvested two full cups of \
leaves and whipped up a vivid green pesto.  In the post I share my go-to ratio \
(2:1 basil to parmesan), why I toast my pine nuts in ghee, and a shortcut for \
vacuum-sealing small jars so the pesto keeps its colour for weeks.',
        files: ['assets/img/posts/pesto-basil-harvest.jpeg'],
      },
      {
        _id: 'g20250726',
        title: 'Monstera Deliciosa: The First Fenestrations!',
        story: 'Planting',
        date: '2025-07-26',
        text:
          'Three months after propagating a Monstera cutting I finally spotted the \
first fenestrated leaf.  I cover the LECA-to-soil transition, the exact humidity \
schedule I used, and a simple kelp-based fertiliser that seems to have kick-started \
growth.  Plenty of photos for the plant nerds!',
        files: [
          'assets/img/posts/monstera-fenestration-1.jpeg',
          'assets/img/posts/monstera-fenestration-2.jpeg',
        ],
      },
      {
        _id: 'p20250723',
        title: 'Building a Tiny CLI with Clap v4 & Color-Eyre',
        story: 'Programming',
        date: '2025-07-23',
        text:
          'I needed a quick tool to bulk-rename image files for the blog.  Instead of \
reaching for bash, I spun up a small Rust CLI using `clap` for argument parsing \
and `color-eyre` for pretty error reports.  The binary is <100 kB and executes in \
2 ms.  Source code and install instructions included.',
        files: [],
      },
      {
        _id: 'c20250718',
        title: 'Fermenting Hot Sauce with Homegrown Apache Chillies',
        story: 'Cooking',
        date: '2025-07-18',
        text:
          'The Apache chilli plant on my windowsill produced nearly 200 pods this \
season.  I fermented half of them with garlic and onion for 10 days and then \
blended the mash into a tangy, fiery sauce.  Full recipe, brine ratio, and \
tips on achieving the perfect pH inside.',
        files: ['assets/img/posts/apache-chillies-ferment.jpeg'],
      },
      {
        _id: 'g20250712',
        title: 'String of Pearls Propagation Success Rate Experiment',
        story: 'Planting',
        date: '2025-07-12',
        text:
          'I tried three propagation methods (water, sphagnum moss, LECA) for my \
String of Pearls cuttings.  After six weeks the moss method had a 90 % success \
rate versus 60 % for water.  Data charts and care notes inside.',
        files: [],
      },
      {
        _id: 'p20250705',
        title: 'Migrating the Blog to Astro on the Edge (Spoiler: Not Yet)',
        story: 'Programming',
        date: '2025-07-05',
        text:
          'Everyone is hyped about Astro but after a weekend prototype I found the \
SSR story tricky with my Rust backend.  I detail the pros, the pain points, and \
why I’m sticking with Angular + Rocket for now.',
        files: [],
      },
      {
        _id: 'c20250628',
        title: 'Sourdough Focaccia with Rosemary from the Balcony',
        story: 'Cooking',
        date: '2025-06-28',
        text:
          'My latest sourdough experiment combined a 75 % hydration dough with fresh \
rosemary snipped minutes before baking.  The post includes a timelapse of the \
bulk rise, crumb shots, and a quick guide to achieving those classic \
focaccia air pockets.',
        files: ['assets/img/posts/focaccia-crumb.jpeg'],
      },
      {
        _id: 'g20250620',
        title: 'DIY Self-Watering Planter Using a Raspberry Pi Pico',
        story: 'Planting',
        date: '2025-06-20',
        text:
          'Combining my love of electronics and plants, I built a self-watering \
planter with a soil moisture sensor, a Pico, and a small peristaltic pump.  \
The device keeps my Calathea hydrated while I’m away.  Full schematic, \
MicroPython code, and cost breakdown inside.',
        files: [
          'assets/img/posts/pico-planter-setup.jpeg',
          'assets/img/posts/pico-planter-schematic.png',
        ],
      },
    ];

    return of(blogs);
  }

  // The service is stateless; no constructor logic needed for now.
}
